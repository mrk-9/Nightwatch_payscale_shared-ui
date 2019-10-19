import * as React from 'react';
import AutoComplete from '../AutoComplete';
import { buildClassString, replaceTokens } from '../StringUtils';
import strings from './strings';
import './style/index.scss';

export interface SearchResultCallback {
    (searchString: string, results: string[]): void;
}

export interface SelectableItemsProps {
    className?: string;                // classname to be added to parent DIV
    initialItems: Set<string>;         // initial set of selected items to show
    possibleItems: Set<string>;        // set of possible items user can select/opt in
    onItemsSelect: (items: Set<string>) => void; // callback called when set of selected items changes due to user input
    searchCallback?: (searchStr: string, callback: SearchResultCallback) => void;
    searchPlaceholderText?: string;    // placeholder text to display in search/auto-complete widget
    headerText: string;                // string to be injected into headers, describing domain of what we're editing
    title?: string;                    // Title to be displayed at top of component, if provided
}

export interface SelectableItemsState {
    addedItems: Set<string>;              // new items added via autocomplete
    itemState: {[item: string]: boolean}; // current selected state of items
    searchResults: string[];              // current results for any autocomplete search string
}

// callback to pass to autocomplete, mapping the display string to the item
const getItemValue = (item: string) => item;

// Widget which displays a set of options as pills for the user to select/deselect.  They are displayed
// as a group of 'current' or 'selected' items at top, with a set of 'possible' items at the bottom
// that aren't selected by default.  There is also a search/autocomplete for the user to search for/
// add additional items that aren't in either set
class SelectableItems extends React.PureComponent<SelectableItemsProps, SelectableItemsState> {
    private _searchString: string; // most recent search string, to compare with results

    constructor(props: SelectableItemsProps) {
        super(props);

        // initialize selected state of items
        const { initialItems, possibleItems } = props;
        const itemState: {[item: string]: boolean} = {};

        if (initialItems) {
            initialItems.forEach(item => itemState[item] = true);
        }

        if (possibleItems) {
            possibleItems.forEach(item => itemState[item] = false);
        }

        this.state = Object.assign(
            {},
            this.state,
            {
                addedItems: new Set<string>(),
                itemState,
                searchResults: []
            });

        this._searchString = '';

        this._handleSearchChange = this._handleSearchChange.bind(this);
        this._handleSearchSelect = this._handleSearchSelect.bind(this);
    }

    componentWillReceiveProps(nextProps: SelectableItemsProps): void {
        const { initialItems, possibleItems } = this.props;
        const {
            initialItems: nextInitialItems,
            possibleItems: nextPossibleItems } = nextProps;

        // remove any provided items from added items set
        const { addedItems, itemState } = this.state;
        const newAddedItems = new Set(addedItems);
        nextInitialItems.forEach(item => newAddedItems.delete(item));
        nextPossibleItems.forEach(item => newAddedItems.delete(item));

        // start by initializing state based on new groups
        const newItemState: typeof itemState = {};
        nextInitialItems.forEach(item => newItemState[item] = true);
        nextPossibleItems.forEach(item => newItemState[item] = false);
        newAddedItems.forEach(item => newItemState[item] = true);

        // then go through and apply any still-applicable overrides from previous groups
        initialItems.forEach(item => {
            // if value that defaults to selected was deselected, then ensure
            // deselected now also
            if (newItemState[item] && itemState[item] === false) {
                newItemState[item] = false;
            }
        });

        possibleItems.forEach(item => {
            // if value that defaults to unselected was selected, then ensure
            // selected now also
            if (newItemState[item] === false && itemState[item]) {
                newItemState[item] = true;
            }
        });

        addedItems.forEach(item => {
            // for added items, if they were selected and now aren't (possibly due to moving
            // to the 'possible' group), then ensure they're selected still
            if (newItemState[item] === false && itemState[item]) {
                newItemState[item] = true;
            }
        });

        this.setState({
            addedItems: newAddedItems,
            itemState: newItemState
        });
        this._notifySelectionChange(newItemState);
    }

    render(): JSX.Element {
        const { className, title } = this.props;
        return (
            <div className={`selectable-items ${className ? className : ''}`}>
                {title && <div className="selectable-items-header">{title}</div>}
                {this._renderInitialItems()}
                {this._renderPossibleItems()}
            </div>
        );
    }

    // Render section containing the initially selected items
    private _renderInitialItems(): JSX.Element {
        const { initialItems, headerText } = this.props;
        if (!initialItems || initialItems.size === 0) {
            return null;
        }

        return (
            <div className="items-section initial">
                <div className="items-header">
                    {replaceTokens(strings.initialItemsHeader, headerText)}
                </div>
                <div className="item-container">
                    {[...initialItems].map(item => this._renderItem(item))}
                </div>
            </div>
            );
    }

    // Render section with available options to select/add, as well
    // as a search/auto-complete for finding extra items
    private _renderPossibleItems(): JSX.Element {
        const {
            possibleItems,
            searchPlaceholderText,
            headerText } = this.props;
        const { searchResults, addedItems } = this.state;

        const allPossibleItems = [...addedItems, ...(possibleItems || [])];
        const hasPossibleItems = allPossibleItems && allPossibleItems.length > 0;
        return (
            <div className="items-section possible">
                <div className="items-header">
                    {replaceTokens(strings.suggestedItemsHeader, headerText)}
                </div>
                <AutoComplete
                    getItemValue={getItemValue}
                    items={searchResults}
                    onInputChange={this._handleSearchChange}
                    onSelect={this._handleSearchSelect}
                    placeholderText={searchPlaceholderText}
                />
                { hasPossibleItems &&
                    <div className="item-container">
                        {allPossibleItems.map(item => this._renderItem(item))}
                    </div>
                }
            </div>
        );
    }

    // Renders a given item (pill)
    private _renderItem(item: string): JSX.Element {
        const { itemState } = this.state;

        const classString = buildClassString({
            'selectable-item': true,
            'active': !!itemState[item]
        });

        const onClick = () => this._toggleItemState(item);
        return (
            <button
                className={classString}
                key={item}
                onClick={onClick}
            >
                {item}
            </button>
        );
    }

    // Toggles the current selection state of the given item
    private _toggleItemState(item: string): void {
        const { itemState } = this.state;
        const newItemState = Object.assign({}, itemState, {[item]: !itemState[item]});

        this.setState({itemState: newItemState});
        this._notifySelectionChange(newItemState);
    }

    // Handle change in the search text in the autocomplete
    // by calling the searchCallback provided in props, and
    // updating our state/re-rendering the auto-complete with the results
    private _handleSearchChange(value: string): void {
        const { searchCallback } = this.props;

        // save this off so we can compare against results
        // as they come back, ensuring we only show results
        // for the most recent query
        this._searchString = value;

        if (searchCallback) {
            searchCallback(value, (term, results) => {
                if (term === this._searchString) {
                    // only update results if they match the most
                    // recent search
                    this.setState({ searchResults: results });
                }
            });
        }
    }

    // Handle selection of an item in the autocomplete drop-down
    // by adding it to our set of added items
    private _handleSearchSelect(value: string): void {
        const { itemState, addedItems } = this.state;

        if (itemState[value]) {
            // item already exists and is selected, just no-op
            return;
        }

        // if value doesn't already exist in a group, then add it
        const newAddedItems = itemState[value] == null ?
            new Set(addedItems).add(value) :
            addedItems;
        const newItemState = Object.assign({}, itemState, {[value]: true});

        this.setState({
            addedItems: newAddedItems,
            itemState: newItemState
        });
        this._notifySelectionChange(newItemState);
    }

    // Notify parent of updated selection
    private _notifySelectionChange(itemState: {[item: string]: boolean}): void {

        const { onItemsSelect } = this.props;
        if (!onItemsSelect) {
            return;
        }

        const selected = new Set(Object.keys(itemState).filter(key => !!itemState[key]));
        onItemsSelect(selected);
    }
}

export { SelectableItems };
export default SelectableItems;
