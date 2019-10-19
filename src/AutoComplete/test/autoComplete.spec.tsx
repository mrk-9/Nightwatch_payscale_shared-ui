import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AutoComplete from '../index';
import ReactAutocomplete from 'react-autocomplete';
import SearchInput from '../../SearchInput';

describe('Autocomplete', () => {
    let autoComplete: ReactWrapper;
    const getItemValue = (item: string) => item;

    afterEach(() => {
        if (autoComplete) {
            autoComplete.unmount();
            autoComplete = null;
        }
    });

    it('should pass through placeholder text to SearchInput', () => {
        const placeholder = 'some text';
        autoComplete = mount(
            <AutoComplete
                items={[]}
                getItemValue={getItemValue}
                placeholderText={placeholder}
            />);
        expect(autoComplete.find(SearchInput).props().placeholderText).toBe(placeholder);
    });

    describe('menu', () => {
        it('should not display if there are no items', () => {
            autoComplete = mount(
                <AutoComplete
                    getItemValue={getItemValue}
                    items={[]}
                />
            );

            const input = autoComplete.find('input').first();
            input.simulate('focus');

            expect(autoComplete.find('.autocomplete__menu').exists()).toBe(false);
            expect(autoComplete.find('.autocomplete__item').length).toBe(0);
        });

        it('should display if there are items', () => {
            const items = ['yep', 'yeeeep'];
            autoComplete = mount(
                <AutoComplete
                    getItemValue={getItemValue}
                    items={items}
                />
            );

            const input = autoComplete.find('input').first();
            input.simulate('focus');

            expect(autoComplete.find('.autocomplete__menu').exists()).toBe(true);
            expect(autoComplete.find('.autocomplete__item').length).toBe(items.length);
        });

        it('should call onSelect callback when item selected', () => {
            const selectSpy = jasmine.createSpy('onSelect');
            const items = ['yep', 'yeeeep'];
            autoComplete = mount(
                <AutoComplete
                    getItemValue={getItemValue}
                    items={items}
                    onSelect={selectSpy}
                />
            );

            const input = autoComplete.find('input').first();
            input.simulate('focus');
            autoComplete.find('.autocomplete__item').first().simulate('click');
            expect(selectSpy).toHaveBeenCalledWith(items[0], items[0]);
        });
    });

    describe('clearSearchOnSelect', () => {
        it('should clear on select if specified', () => {
            autoComplete = mount(
                <AutoComplete
                    clearSearchOnSelect={true}
                    getItemValue={getItemValue}
                    items={[]}
                />
            );

            const clearSpy = spyOn(autoComplete.find(SearchInput).instance() as SearchInput, 'clear');
            (autoComplete.find(ReactAutocomplete) as any).props().onSelect(); // tslint:disable-line no-any
            expect(clearSpy).toHaveBeenCalled();
        });

        it('should not clear on select if not specified', () => {
            autoComplete = mount(
                <AutoComplete
                    clearSearchOnSelect={false}
                    getItemValue={getItemValue}
                    items={[]}
                />
            );

            const clearSpy = spyOn(autoComplete.find(SearchInput).instance() as SearchInput, 'clear');
            (autoComplete.find(ReactAutocomplete) as any).props().onSelect(); // tslint:disable-line no-any
            expect(clearSpy).not.toHaveBeenCalled();
        });
    });

    describe('setValueOnSelect', () => {
        it('should set the value on select if specified', () => {
            autoComplete = mount(
                <AutoComplete
                    clearSearchOnSelect={false}
                    setValueOnSelect={true}
                    getItemValue={getItemValue}
                    items={[]}
                />
            );

            const setValueSpy = spyOn(autoComplete.find(SearchInput).instance() as SearchInput, 'setValue');
            (autoComplete.find(ReactAutocomplete) as any).props().onSelect(); // tslint:disable-line no-any
            expect(setValueSpy).toHaveBeenCalled();
        });
    });
});
