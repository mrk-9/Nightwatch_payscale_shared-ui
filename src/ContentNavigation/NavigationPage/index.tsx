import * as React from 'react';
import { animationManager, EasingEquation } from '../../AnimationUtils';
import { throttle } from '../../TimingUtils';

import './style/index.scss';

export interface NavigationPageProps {
    navHeaderText?: string;                 // display title of the navigation menu
    maxLevel?: number;                      // levels of child component structure to find menu items
    children?: JSX.Element | JSX.Element[]; // child components
    scrollOffsetTop?: number;               // Set if scroll area is offset from the top of the page
}

export interface NavigationPageState {
    activeItem: NavItem; // The currenct active menu item
    navItems: NavItem[]; // List of navigation items
}

export interface NavItem {
    title: string;        // Display Title
    level: number;        // Embed level of anchor
    index: number;        // Array index
    offsetTop: number;    // DOM display offset top in pixels
    anchor: HTMLElement;  // Anchor HTML DOM Element
}

export class NavigationPage extends React.PureComponent<
    NavigationPageProps,
    NavigationPageState
> {
    private _scrollingContent: HTMLDivElement; // The element that houses the scrolling area
    private _throttledScrollListener: EventListener; // Throttled Scroll Listener
    private _navigatingToItem: Boolean; // Page is navigating to an item
    constructor(props: NavigationPageProps) {
        super(props);
        this.state = Object.assign({}, this.state, {
            activeItem: null
        });
        this._scrollListener = this._scrollListener.bind(this);
        this._removeScrollListener = this._removeScrollListener.bind(this);
    }

    componentDidMount(): void {
        if (this._scrollingContent) {
            const navItems = this._createNavItemsRecursive(
                new Array(),
                this._scrollingContent.children,
                0
            );

            this.setState({
                navItems,
                activeItem: navItems[0]
            });
            this._setScrollListener();
        }
    }

    componentWillUnmount(): void {
        this._removeScrollListener();
    }

    componentWillUpdate(): void {
        this._setScrollListener();
    }

    render(): JSX.Element {
        const { children, navHeaderText } = this.props;
        const { navItems, activeItem } = this.state;
        return (
            <div className="nav-page">
                <div className="nav-page__nav">
                    {navHeaderText && (
                        <div className="nav-page__nav-header">
                            {navHeaderText}
                        </div>
                    )}
                    <ul className="nav-page__nav-items">
                        {navItems &&
                            navItems.map((navItem: NavItem, index: number) => {
                                return (
                                    <li
                                        className={`nav-item ${
                                            activeItem &&
                                            activeItem.index === index
                                                ? 'active'
                                                : ''
                                        }`}
                                        onClick={this._navigateToItem.bind(
                                            this,
                                            index
                                        )}
                                        key={`${index} ${navItem.title}`}
                                    >
                                        <a>{navItem.title}</a>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
                <div
                    className="nav-page__content"
                    ref={ref => (this._scrollingContent = ref)}
                >
                    {children}
                </div>
            </div>
        );
    }

    private _scrollListener(): void {
        const { activeItem, navItems } = this.state;
        const top: number = this.props.scrollOffsetTop ? this.props.scrollOffsetTop : 70;
        if (this.state && navItems && !this._navigatingToItem) {
            const nextItem = navItems.find(
                (element: NavItem, index: number) => {
                    if (!element) {
                        return false;
                    }

                    const position = element.anchor.getBoundingClientRect();
                    // When Anchor Scrolls Between upperbound of scroll container and
                    // specified lower bound return true
                    return position.top > top && position.top < top + 100;
                }
            );

            if (nextItem !== activeItem && nextItem) {
                this.setState({
                    activeItem: nextItem
                });
            }
        }
    }

    private _setScrollListener(): void {
        const { navItems } = this.state;
        if (!navItems || navItems.length === 0) {
            return;
        }

        if (this._throttledScrollListener) {
            return;
        }

        this._throttledScrollListener = throttle(this._scrollListener);
        this._throttledScrollListener = this._throttledScrollListener.bind(this);

        window.addEventListener(
            'scroll',
            this._throttledScrollListener,
            true
        );
    }

    private _removeScrollListener(): void {
        if (this._throttledScrollListener) {
            window.removeEventListener(
                'scroll',
                this._throttledScrollListener,
                true
            );
            this._throttledScrollListener = null;
        }
    }

    // Recursively searches for anchors in the children up to the max level of the component
    private _createNavItemsRecursive(
        navItems: NavItem[],
        children: HTMLCollection,
        level: number
    ): NavItem[] {
        const { maxLevel } = this.props;

        level++;
        Array.from(children).forEach(child => {
            const href = child.getAttribute('href');
            // Only generate NavItems from page anchors
            if (child.nodeName === 'A' && (!href || href.indexOf('#') === 0)) {
                const anchor: HTMLElement = child as HTMLElement;
                navItems.push({
                    title: child.textContent,
                    level,
                    index: navItems.length,
                    offsetTop: anchor.offsetTop,
                    anchor
                });
            }

            if (child.children) {
                if (!maxLevel || level <= maxLevel) {
                    this._createNavItemsRecursive(
                        navItems,
                        child.children,
                        level
                    );
                }
            }
        });

        return navItems;
    }

    private _navigateToItem(index: number): void {
        const { navItems } = this.state;
        const duration = 0.25;
        // Only listen to scrolling when user is scrolling
        this._navigatingToItem = true;
        this.setState({
            activeItem: navItems[index]
        });

        animationManager.createAnimation(
            this._scrollingContent.scrollTop, // start value
            navItems[index].offsetTop, // end value
            duration, // duration (in s)
            EasingEquation.EaseOutSine, // easing function
            (val: number) => (this._scrollingContent.scrollTop = val) // callback with each value
        );
        // Re-enable scroll listener
        setTimeout(() => {
            this._navigatingToItem = false;
        }, duration * 1000);
    }
}

export default NavigationPage;
