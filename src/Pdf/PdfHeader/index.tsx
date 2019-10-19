import * as React from 'react';
import { buildClassString } from '../../StringUtils';

export interface PdfHeaderProps {
    className?: string;
    children?: JSX.Element | JSX.Element[];
}

export const PdfHeader = (props: PdfHeaderProps) => {
    const { className, children } = props;
    const finalClassName = buildClassString({
        'pdf-header': true,
        [className]: !!className
    });

    return (
        <div className={finalClassName}>
            {children}
        </div>
    );
};

export default PdfHeader;