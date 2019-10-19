import * as React from 'react';
import { shallow } from 'enzyme';
import GrowAnimationContainer from '../index';

describe('GrowAnimationContainer', () => {
    it('should *not* set fade class when fade prop not passed in', () => {
        const result = shallow(<GrowAnimationContainer />);
        expect(result.find('.inner-grow-container').hasClass('fade')).toBe(false);
    });

    it('should set fade class when fade prop passed in', () => {
        const result = shallow(<GrowAnimationContainer fade={true} />);
        expect(result.find('.inner-grow-container').hasClass('fade')).toBe(true);
    });

    it('should *not* set growDown class when growDown prop not passed in', () => {
        const result = shallow(<GrowAnimationContainer />);
        expect(result.find('.inner-grow-container').hasClass('grow-down')).toBe(false);
    });

    it('should set growDown class when growDown prop passed in', () => {
        const result = shallow(<GrowAnimationContainer growDown={true} />);
        expect(result.find('.inner-grow-container').hasClass('grow-down')).toBe(true);
    });

    it('should not show by default if initiallyExpanded is false', () => {
        const result = shallow(<GrowAnimationContainer />);
        expect(result.find('.inner-grow-container').hasClass('show')).toBe(false);
    });

    it('sould show if initallyExpanded is true', () => {
        const result = shallow(<GrowAnimationContainer initiallyExpanded={true}/>);
        expect(result.find('.inner-grow-container').hasClass('show')).toBe(true);
    });
});
