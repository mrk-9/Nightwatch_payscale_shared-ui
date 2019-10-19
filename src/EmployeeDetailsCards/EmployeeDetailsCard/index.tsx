import * as React from 'react';
import strings from './strings';
import './style/index.scss';

export interface EmployeeDetailsCardProps {
    dateOfHire?: string;                // EE's (unformatted) hire date
    employeeId?: (number|string);       // EE's ID
    workLocation?: string;              // EE's work city/location
    managerName?: string;               // EE's manager's name
    email?: string;                     // EE's email addres
    department?: string;                // EE's departmen name
    dateFormatter: (date: string, formatString: string) => string; // Func to format dates
}

// Desired format string for dates in card
const dateFormatStr = 'MMMM DD, YYYY';

// Card component which displays core details about the employee -- hireDate, ID, etc
class EmployeeDetailsCard extends React.PureComponent<EmployeeDetailsCardProps, {}> {
    render(): JSX.Element {
        const {
            dateOfHire,
            employeeId,
            workLocation,
            managerName,
            email,
            department,
            dateFormatter } = this.props;

        // if nothing to render, render nothing
        if (dateOfHire == null &&
            employeeId == null &&
            workLocation == null &&
            managerName == null &&
            email == null &&
            department == null) {
            return null;
        }

        return (
            <ul className="ee-details-card">
                {dateOfHire && this._renderListItem(
                    strings.hireDate,
                    dateFormatter ?
                        dateFormatter(dateOfHire, dateFormatStr) :
                        dateOfHire,
                    'icon-calendar')}
                {employeeId && this._renderListItem(
                    strings.employeeId,
                    employeeId,
                    'icon-v-card')}
                {workLocation && this._renderListItem(
                    strings.location,
                    workLocation,
                    'icon-location')}
                {managerName && this._renderListItem(
                    strings.manager,
                    managerName,
                    'icon-user')}
                {email && this._renderListItem(
                    strings.email,
                    <a className="underline" href={`mailto:${email}`}>
                        {email}
                    </a>,
                    'icon-paper-plane')}
                {department && this._renderListItem(
                    strings.department,
                    department,
                    'icon-sitemap')}
            </ul>
        );
    }

    private _renderListItem(
        title: string,                        // title text to display for item
        content: string|number|JSX.Element,   // content/value to display for item
        icon: string): JSX.Element {          // item icon

        return (
            <li className="ee-details-card__list-item" key={title}>
                <div className="ee-details-card__item">
                    <i className={`ee-details-card__item-icon ${icon}`} />
                    <div className="ee-details-card__item-content">
                        <h5 className="ee-details-card__item-header">{title}</h5>
                        <div className="ee-details-card__item-value">
                            {content}
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

export { EmployeeDetailsCard };
export default EmployeeDetailsCard;