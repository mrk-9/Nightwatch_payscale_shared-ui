import * as React from 'react';
import './style/index.scss';
import { buildClassString } from '../../StringUtils';

export interface PdfProps {
    className?: string;
    children?: JSX.Element | JSX.Element[];
}

export const Pdf = (props: PdfProps) => {
    const { className, children } = props;
    const finalClassName = buildClassString({
        pdf: true,
        [className]: !!className
    });

    return (
        <div className={finalClassName}>
            {children}
        </div>
    );
};

export default Pdf;