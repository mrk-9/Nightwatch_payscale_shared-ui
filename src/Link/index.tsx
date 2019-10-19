import * as React from 'react';
import { HistoryApi } from '../Types/historyApi';

export interface LinkProps {
    className?: string;
    history: HistoryApi;
    href?: string;
    onClick?: Function;
}

class Link extends React.PureComponent<LinkProps, {}> {
    render(): JSX.Element {
        const { href, className, children } = this.props;
        return (
            <a
                href={href || '#'}
                className={className}
                onClick={this._handleClick}
            >
                {children}
            </a>
        );
    }

    private _handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // only care about left click
        if (event.button !== 0) {
            return;
        }

        // call click handler, if passed
        const { onClick, href } = this.props;
        if (onClick) {
            onClick(event);
        }

        // if handler indicates prevent default, just return
        if (event.defaultPrevented) {
            return;
        }

        // ctrl+click or apple+click = open in new tab, so
        // let the browser do default handling
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();

            const { history } = this.props;
            if (href && history) {
                history.push(href);
            }
        }
    }
}

export { Link };
export default Link;
