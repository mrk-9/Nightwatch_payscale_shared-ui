import * as React from 'react';
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme';
import SearchInput from '../index';

describe('SearchInput', () => {
    let result: ShallowWrapper | ReactWrapper;

    afterEach(() => {
        if (result) {
            result.unmount();
            result = null;
        }
    });

    it('should apply input role if provided', () => {
        const role = 'somerole';
        result = shallow(<SearchInput inputRole={role} />);
        expect(result.find('input').props().role).toBe(role);
    });

    it('should pass through placeholder text if provided', () => {
        const placeholder = 'text goes here';
        result = shallow(<SearchInput placeholderText={placeholder} />);
        expect(result.find('input').props().placeholder).toBe(placeholder);
    });

    it('should call ref callback on mount', () => {
        const refSpy = jasmine.createSpy('inputRef');
        result = mount(<SearchInput inputRef={refSpy} />);
        expect(refSpy).toHaveBeenCalled();
        expect((refSpy.calls.argsFor(0)[0] as HTMLInputElement).tagName).toBe('INPUT');
    });

    it('should call blur handler if blurred', () => {
        const blurSpy = jasmine.createSpy('onBlur');
        result = shallow(<SearchInput onBlur={blurSpy} />);
        result.find('input').simulate('blur');
        expect(blurSpy).toHaveBeenCalled();
    });

    it('should call click handler if clicked', () => {
        const clickSpy = jasmine.createSpy('onClick');
        result = shallow(<SearchInput onClick={clickSpy} />);
        result.find('input').simulate('click');
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should call focus handler if given focus', () => {
        const focusSpy = jasmine.createSpy('onFocus');
        result = shallow(<SearchInput onFocus={focusSpy} />);
        result.find('input').simulate('focus');
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should call key handler on keydown', () => {
        const keySpy = jasmine.createSpy('onKeyDown');
        result = shallow(<SearchInput onKeyDown={keySpy} />);
        result.find('input').simulate('keydown', {isDefaultPrevented: () => false});
        expect(keySpy).toHaveBeenCalled();
    });

    it('focus() should give focus to input', () => {
        result = mount(<SearchInput />);
        (result.instance() as SearchInput).focus();

        const focusedElement = document.activeElement;
        expect(result.find('input').getDOMNode()).toEqual(focusedElement);
    });

    describe('clear', () => {
        it('should not call change callback if already clear', () => {
            const changeSpy = jasmine.createSpy('onChange');
            result = shallow(<SearchInput onChange={changeSpy} />);
            (result.instance() as SearchInput).clear();
            expect(changeSpy).not.toHaveBeenCalled();
        });

        it('should call change callback if has a value', () => {
            const changeSpy = jasmine.createSpy('onChange');
            result = shallow(<SearchInput onChange={changeSpy} />);
            result.setState({value: 'foo'});
            (result.instance() as SearchInput).clear();
            expect(changeSpy).toHaveBeenCalledWith('');
        });
    });

    describe('set value on select', () => {
      it('should set the value when selecting an item', () => {
        const changeSpy = jasmine.createSpy('onChange');
        result = shallow(<SearchInput onChange={changeSpy} />);
        result.setState({value: 'foo'});
        (result.instance() as SearchInput).setValue('foo selected');
        expect(changeSpy).toHaveBeenCalledWith('foo selected');
      });
    });

    describe('clear button', () => {
        it('should be hidden when value is empty', () => {
            result = shallow(<SearchInput />);
            result.setState({value: ''});
            expect(result.find('.search-input__clear-btn').hasClass('hidden')).toBe(true);
        });

        it('should be visible when non-empty', () => {
            result = shallow(<SearchInput />);
            result.setState({value: 'foo'});
            expect(result.find('.search-input__clear-btn').hasClass('hidden')).toBe(false);
        });

        it('should clear value when clicked', () => {
            const changeSpy = jasmine.createSpy('onChange');
            result = shallow(<SearchInput onChange={changeSpy} />);
            result.setState({value: 'foo'});
            expect(result.find('.search-input__clear-btn').hasClass('hidden')).toBe(false);
            result.find('.search-input__clear-btn').simulate('click');
            expect(changeSpy).toHaveBeenCalledWith('');
            expect(result.find('.search-input__clear-btn').hasClass('hidden')).toBe(true);
        });
    });

    describe('keydown', () => {
        it('should trigger clear if escape pressed', () => {
            result = shallow(<SearchInput />);
            const clearSpy = spyOn(result.instance() as SearchInput, 'clear');
            result.find('input').simulate('keydown', {key: 'Escape', isDefaultPrevented: () => false});
            expect(clearSpy).toHaveBeenCalled();
        });

        it('should lose focus if escape is pressed', () => {
            result = mount(<SearchInput />);
            const blurSpy = spyOn(result.find('input').getDOMNode() as HTMLInputElement, 'blur');
            result.find('input').simulate('keydown', {key: 'Escape', isDefaultPrevented: () => false});
            expect(blurSpy).toHaveBeenCalled();
        });

        it('should not clear if key handler is provided and default is prevented', () => {
            result = shallow(<SearchInput />);
            const clearSpy = spyOn(result.instance() as SearchInput, 'clear');
            result.find('input').simulate('keydown', {key: 'Escape', isDefaultPrevented: () => true});
            expect(clearSpy).not.toHaveBeenCalled();
        });
    });
});
