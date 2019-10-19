import * as React from 'react';
import { buildClassString } from '../../StringUtils';
import './style/index.scss';

export interface PdfPageProps {
    className?: string;
    children?: JSX.Element | JSX.Element[];
}

export const PdfPage = (props: PdfPageProps) => {
    const { className, children } = props;
    const finalClassName = buildClassString({
        'pdf-page': true,
        [className]: !!className
    });

    return (
        <div className={finalClassName}>
            <div className="pdf-page__inner">
                {children}
            </div>
        </div>
    );
};

export default PdfPage;