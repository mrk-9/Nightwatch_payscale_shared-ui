import * as React from 'react';
import { shallow } from 'enzyme';
import LabeledValue from '../index';

describe('LabeledValue', () => {
    it('should render label container and provided label element', () => {
        const text = 'foo';
        const result = shallow(
            <LabeledValue
                label={<div className="label-elt">{text}</div>}
                value={null}
            />
        );

        expect(result.find('.labeled-value').length).toBe(1);
        expect(result.find('.labeled-value__label').length).toBe(1);
        expect(result.find('.label-elt').length).toBe(1);
        expect(result.find('.label-elt').text()).toBe(text);
    });

    it('should render value container and provided value element', () => {
        const text = 'foo';
        const result = shallow(
            <LabeledValue
                value={<div className="value-elt">{text}</div>}
                label={null}
            />
        );

        expect(result.find('.labeled-value').length).toBe(1);
        expect(result.find('.labeled-value__value').length).toBe(1);
        expect(result.find('.value-elt').length).toBe(1);
        expect(result.find('.value-elt').text()).toBe(text);
    });
});
