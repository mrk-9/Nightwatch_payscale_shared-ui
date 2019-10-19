import * as React from 'react';
import { shallow } from 'enzyme';
import SelectableItems, { SelectableItemsState } from '../index';
import { replaceTokens } from '../../StringUtils';
import AutoComplete from '../../AutoComplete';
import strings from '../strings';

describe('SelectableItems', () => {
    const currentItems = new Set(['testing']);
    const possibleItems = new Set(['possible testing']);

    describe('title', () => {
        it('should not render if not provided', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.selectable-items-header').exists()).toBe(false);
        });

        it('should render if provided', () => {
            const title = 'a title';
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                    title={title}
                />
            );

            expect(main.find('.selectable-items-header').text()).toBe(title);
        });
    });

    describe('initial', () => {
        it('should not render initial section if there are not initial items', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            const initialSection = main.find('.items-section.initial');
            expect(initialSection.exists()).toBe(false);
        });

        it('should render initial section if there are initial items', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            const initialSection = main.find('.items-section.initial');
            expect(initialSection.exists()).toBe(true);
            expect(initialSection.find('.item-container .selectable-item').length).toBe(1);
        });

        it ('should render header with headerText inserted', () => {
            const headerText = 'testing';
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={headerText}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.initial .items-header').text())
                .toBe(replaceTokens(strings.initialItemsHeader, headerText));
        });

        it('should render initial items as active', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.initial .selectable-item').hasClass('active')).toBe(true);
        });

        it('should deselect initial item when clicked', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.initial .selectable-item').hasClass('active')).toBe(true);
            main.find('.items-section.initial .selectable-item').simulate('click');
            expect(main.find('.items-section.initial .selectable-item').hasClass('active')).toBe(false);
        });
    });

    describe('possible', () => {
        it('should render possible section even if no possible items', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={new Set()}
                    possibleItems={new Set()}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.possible').exists()).toBe(true);
        });

        it('should render possible items if provided', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />);

            expect(main.find('.items-section.possible .selectable-item').length).toBe(1);
        });

        it ('should render header with headerText inserted', () => {
            const headerText = 'testing';
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={headerText}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.possible .items-header').text())
                .toBe(replaceTokens(strings.suggestedItemsHeader, headerText));
        });

        it('should render possible items as not active', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />);

            expect(main.find('.items-section.possible .selectable-item').hasClass('active')).toBe(false);
        });

        it('should select possible items when clicked', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            expect(main.find('.items-section.possible .selectable-item').hasClass('active')).toBe(false);
            main.find('.items-section.possible .selectable-item').simulate('click');
            expect(main.find('.items-section.possible .selectable-item').hasClass('active')).toBe(true);
        });

        it('should add a new button in the possible section for added items', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={null}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            main.setState({ addedItems: new Set(['lol']) });
            const possibleSection = main.find('.items-section.possible .item-container');
            expect(possibleSection.find('.selectable-item').length).toBe(2);
        });
    });

    describe('onItemsSelect', () => {
        it('should exclude deselected initial item', () => {
            const onItemsSelect = jasmine.createSpy('onItemsSelect');
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={null}
                    headerText={'Testing'}
                    onItemsSelect={onItemsSelect}
                />
            );

            main.find('.items-section.initial .selectable-item').simulate('click');
            expect(onItemsSelect).toHaveBeenCalledWith(new Set());
        });

        it('should include selected possible item', () => {
            const onItemsSelect = jasmine.createSpy('onItemsSelect');
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={onItemsSelect}
                />
            );

            main.find('.items-section.possible .selectable-item').simulate('click');
            expect(onItemsSelect).toHaveBeenCalledWith(new Set([...currentItems, ...possibleItems]));
        });
    });

    it('should return to initial state after selecting each button twice (adding then removing or vice versa) ', () => {
        const onItemsSelect = jasmine.createSpy('onItemsSelect');
        const main = shallow(
            <SelectableItems
                initialItems={currentItems}
                possibleItems={possibleItems}
                headerText={'testing'}
                onItemsSelect={onItemsSelect}
            />
        );

        const activeButton = main.find('.initial .selectable-item').first();
        expect(activeButton.hasClass('active')).toBe(true);
        const inActiveButton = main.find('.possible .selectable-item').first();
        expect(inActiveButton.hasClass('active')).toBe(false);

        activeButton.simulate('click');
        inActiveButton.simulate('click');
        activeButton.simulate('click');
        inActiveButton.simulate('click');

        // ensure we're back in our initial state
        expect(main.find('.initial .selectable-item').first().hasClass('active')).toBe(true);
        expect(main.find('.possible .selectable-item').first().hasClass('active')).toBe(false);
        expect(onItemsSelect.calls.mostRecent().args[0]).toEqual(currentItems);
    });

    describe('Autocomplete', () => {
        it('should not deselect an item in initial when clicked in the autocomplete', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            const value = [...currentItems][0];
            const autocomplete = main.find(AutoComplete).first();
            autocomplete.props().onSelect(value);
            expect((main.state() as SelectableItemsState).itemState[value]).toBe(true);
        });

        it('should not deselect an item in possible when clicked in the autocomplete', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            const value = [...possibleItems][0];
            const autocomplete = main.find(AutoComplete).first();

            // Click it once to select it
            autocomplete.props().onSelect(value);
            expect((main.state() as SelectableItemsState).itemState[value]).toBe(true);

            // Click it again to prove it's not getting deselected
            autocomplete.props().onSelect(value);
            expect((main.state() as SelectableItemsState).itemState[value]).toBe(true);
        });

        it('should a new, selected item when clicked in the autocomplete', () => {
            const main = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                />
            );

            const value = 'something that doesnt exist';
            const autocomplete = main.find(AutoComplete).first();

            // Click it and see it's added
            autocomplete.props().onSelect(value);
            expect((main.state() as SelectableItemsState).itemState[value]).toBe(true);
        });
        it('should ignore search results when searchTerm isn\'t current', () => {
            const searchSpy = jasmine.createSpy('onSearchChange');
            const editor = shallow(
                <SelectableItems
                    initialItems={currentItems}
                    possibleItems={possibleItems}
                    headerText={'Testing'}
                    onItemsSelect={null}
                    searchCallback={searchSpy}
                />
            );

            const searchTerm = 'foo';
            editor.find(AutoComplete).props().onInputChange(searchTerm);
            expect(searchSpy).toHaveBeenCalled();

            const results = ['stuff', 'thangs'];
            searchSpy.calls.argsFor(0)[1](searchTerm, results);
            expect((editor.state() as SelectableItemsState).searchResults).toBe(results);

            const otherResults = ['other', 'thangs'];
            searchSpy.calls.argsFor(0)[1](searchTerm + 't', otherResults);
            expect((editor.state() as SelectableItemsState).searchResults).toBe(results);
        });
    });
});