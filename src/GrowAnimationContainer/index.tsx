import * as React from 'react';
import { buildClassString } from '../StringUtils';
import { debounce } from '../TimingUtils';
import './style/index.scss';

export interface GrowAnimationContainerProps {
    fade?: boolean;                   // whether or not to fade while expanding/collapsing
    growDown?: boolean;               // whether to start by showing bottom of expanded element
    initiallyExpanded?: boolean;      // initial state to start in (if want to shrink at first)
    show?: boolean;                   // whether to show/expand, or hide/collapse
    onAnimationComplete?: () => void; // callback to fire after any expand/collapse animation is complete
}

export interface GrowAnimationContainerState {
    growState: GrowState;
}

export const enum GrowState {
    Initial = 0, // just to have something as a default
    Expanding,   // currently expanding
    Expanded,    // fully expanded/shown
    Collapsing,  // currently collapsing
    Collapsed    // fully collapsed/hidden
}

// Component which will animate it's children to look like they're 'sliding in' from the top
// as the container grows, pushing down content below it
class GrowAnimationContainer extends React.PureComponent<GrowAnimationContainerProps, GrowAnimationContainerState> {
    private _innerContainerRef: HTMLDivElement;
    private _outerContainerRef: HTMLDivElement;
    private _mounted: boolean;

    constructor(props: GrowAnimationContainerProps) {
        super(props);
        this.state = Object.assign({}, this.state, {
            // set initial state based on props
            growState: props.initiallyExpanded ? GrowState.Expanded : GrowState.Collapsed
        });
        this._innerContainerRef = null;
        this._mounted = false;
        this._onTransitionEnd = this._onTransitionEnd.bind(this);
    }

    componentDidMount(): void {
        // Once mounted, start the animation to show or hide based on the initial
        // state. Do so on a timer to ensure it got rendered in its initial state
        window.setTimeout(() => {
            if (!this._mounted) { return; }

            const { show } = this.props;
            const { growState } = this.state;
            this.setState({
                growState: growState === GrowState.Collapsed && show ?
                    GrowState.Expanding :
                    growState === GrowState.Expanded && !show ?
                        GrowState.Collapsing :
                        growState
            });
        }, 150);
        this._mounted = true;

        if (this._outerContainerRef) {
            // debounce to handle bubbling events from inner container
            this._outerContainerRef.addEventListener(
                'transitionend',
                debounce(this._onTransitionEnd, 50) as EventListener);
        }
    }

    componentWillUnmount(): void {
        this._mounted = false;
    }

    componentDidUpdate(): void {
        const { growState } = this.state;
        const { show } = this.props;

        let newState = growState;
        if (show && (
            growState === GrowState.Collapsed || growState === GrowState.Collapsing)) {
            newState = GrowState.Expanding;
        } else if (!show &&
            (growState === GrowState.Expanded || growState === GrowState.Expanding)) {
            newState = GrowState.Collapsing;
        }

        this.setState({
            growState: newState
        });
    }

    render(): JSX.Element {
        const { children, fade, growDown, show } = this.props;
        const { growState } = this.state;

        let containerStyle = {};
        if (show && growState === GrowState.Expanded) {
            // if fully expanded, clear max height
            containerStyle = { maxHeight: 'none' };
        } else if (growState === GrowState.Expanding || (!show && growState === GrowState.Expanded)) {
            // if either growing or about to collapse, set max height to content
            const maxHeight = this._innerContainerRef ?
                `${this._innerContainerRef.offsetHeight}px` :
                'none';
            containerStyle = { maxHeight };
        }

        const innerContainerClass = buildClassString({
            'inner-grow-container': true,
            'show': growState === GrowState.Expanding || growState === GrowState.Expanded,
            'fade': fade,
            'grow-down': growDown
        });

        return (
            <div
                className="outer-grow-container"
                style={containerStyle}
                ref={ref => this._outerContainerRef = ref}
            >
                <div
                    className={innerContainerClass}
                    ref={ref => this._innerContainerRef = ref}
                >
                    {children}
                </div>
            </div>
        );
    }

    private _onTransitionEnd(): void {
        // once transition is complete, switch to our 'completed' expanded/
        // collapsed state
        const { growState } = this.state;
        let newState = growState;
        if (growState === GrowState.Expanding) {
            newState = GrowState.Expanded;
        } else if (growState === GrowState.Collapsing) {
            newState = GrowState.Collapsed;
        }

        this.setState({ growState: newState });

        const { onAnimationComplete } = this.props;
        if (onAnimationComplete) {
            onAnimationComplete();
        }
    }
}

export { GrowAnimationContainer };
export default GrowAnimationContainer;
