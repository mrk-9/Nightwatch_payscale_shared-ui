import * as React from 'react';
import './style/index.scss';

export interface DetailsCardProps {
    children?: any; // tslint:disable-line no-any
    className?: string;
    title?: string;
}

// Simple 'card' structure for header + content
export const DetailsCard = (props: DetailsCardProps): JSX.Element => {
    const { className, title, children } = props;
    return (
        <div className={`details-card ${className || ''}`}>
            {title && <div className="details-card__header">{title}</div>}
            <div className="details-card__body">
                {children}
            </div>
        </div>
    );
};

export default DetailsCard;