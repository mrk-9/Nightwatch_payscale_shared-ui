import * as React from 'react';

export interface PdfContentProps {
    children?: JSX.Element | JSX.Element[];
}

export const PdfContent = (props: PdfContentProps) => {
    return (
        <div className="pdf-content">
            {props.children}
        </div>
    );
};

export default PdfContent;