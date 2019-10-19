import * as React from 'react';
import strings from './strings';
import './style/index.scss';

export interface PdfFooterProps {
    formattedDate: string;
    footerImagePath?: string;
    footerImageAltText?: string;
    pageNumber?: number;
}

export const PdfFooter = (props: PdfFooterProps) => {
    const {
        pageNumber,
        formattedDate,
        footerImagePath,
        footerImageAltText
    } = props;

    return (
        <div className="pdf-footer">
            <div className="pdf-footer__meta">
                {pageNumber}
                <span className="pdf-footer__divider" />
                {strings.reportDateLabel}&nbsp;
                <span className="pdf-footer__date">{formattedDate}</span>
            </div>
            {footerImagePath &&
                <div className="pdf-footer__logo">
                    <img
                        src={footerImagePath}
                        alt={footerImageAltText || ''}
                    />
                </div>
            }
        </div>
    );
};

export default PdfFooter;