import * as React from 'react';
import './style/index.scss';

export interface LabeledValueProps {
    label: JSX.Element;
    value: JSX.Element;
}

// Simple wrapper around label + value
export const LabeledValue = (props: LabeledValueProps) => {
    return (
        <div className="labeled-value">
            <div className="labeled-value__value">
                {props.value}
            </div>
            <div className="labeled-value__label">
                {props.label}
            </div>
        </div>
    );
};

export default LabeledValue;
