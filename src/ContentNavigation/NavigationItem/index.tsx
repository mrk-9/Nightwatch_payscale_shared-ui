import * as React from 'react';

export interface NavigationItemProps {
    title: string; // display title of the navigation item
    active?: boolean; // whether or not this nav item is active
    children?: JSX.Element | JSX.Element[]; // child components
}

export const NavigationItem = (props: NavigationItemProps) => {
    const { title, active, children } = props;
    return (
        <div className="nav-pageitem">
            <a
                href={`#${title}`}
                className={`nav-pageitem__link ${active ? 'active' : ''}`}
            >
                {title}
            </a>
            {children}
        </div>
    );
};
