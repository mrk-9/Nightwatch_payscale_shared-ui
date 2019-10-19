import * as React from 'react';
import './style/index.scss';

export interface CoverPageDetailProps {
    icon: string;
    name: string;
    value: string;
}

export const CoverPageDetail = (props: CoverPageDetailProps): JSX.Element => {
    const { icon, name, value } = props;
    return (
        <div className="cover-page-detail">
            <div className="cover-page-detail__icon">
                <i className={icon} />
            </div>
            <div className="cover-page-detail__name">
                {name}
            </div>
            <div className="cover-page-detail__value">
                {value}
            </div>
        </div>
    );
};

export default CoverPageDetail;