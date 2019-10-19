import * as React from 'react';
import PdfPage from '../PdfPage';
import CoverPageDetail from '../CoverPageDetail';
import PdfHeader from '../PdfHeader';
import PdfContent from '../PdfContent';
import PdfFooter from '../PdfFooter';
import './style/index.scss';

export interface CoverPageProps {
    formattedDate: string;
    title?: string;
    footerImagePath?: string;
    footerImageAltText?: string;
    logoPath?: string;
    subtitle?: string;
    coverPageDetails?: CoverPageItems[];
    children?: JSX.Element | JSX.Element[];
}

export interface CoverPageItems {
    [key: string]: string;
}

export const CoverPage = (props: CoverPageProps) => {
    const {
        formattedDate,
        title,
        subtitle,
        coverPageDetails,
        footerImagePath,
        footerImageAltText,
        logoPath,
        children
    } = props;

    return (
        <PdfPage className="cover-page">
            {logoPath &&
                <PdfHeader className="cover-page__header">
                    <img src={logoPath} alt="" />
                </PdfHeader>
            }
            <PdfContent>
                {title &&
                    <div className="cover-page__title">
                        {title}
                    </div>
                }
                {subtitle &&
                    <div className="cover-page__subtitle">
                        {subtitle}
                    </div>
                }
                <div className="cover-page__separator" />
                {coverPageDetails &&
                    <div className="cover-page__details">
                        {coverPageDetails.map(detail => {
                            return (
                                <CoverPageDetail
                                    icon={detail.icon}
                                    name={detail.name}
                                    value={detail.value}
                                    key={detail.name}
                                />
                            );
                        })}
                    </div>
                }
                <div className="cover-page__content">
                    {children}
                </div>
            </PdfContent>
            <PdfFooter
                pageNumber={1} // Cover Page is always one
                footerImagePath={footerImagePath}
                footerImageAltText={footerImageAltText}
                formattedDate={formattedDate}
            />
        </PdfPage>
    );
};

export default CoverPage;
