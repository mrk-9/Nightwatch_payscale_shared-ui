import * as React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { buildClassString } from '../StringUtils';
import SearchInput from '../SearchInput';
import './style/index.scss';

export interface AutoCompleteProps {
    // Whether or not to clear search input when an item is selected
    clearSearchOnSelect?: boolean;

    // Whether or not to set search input to item selected
    setValueOnSelect?: boolean;

    // Given a search result/item, return the value to pass back when the item is selected
    getItemValue: (item: {} | string) => string;

    // Items to display in the autocomplete results
    items: Array<{}>;

    // Callback when the user updates the value in the autocomplete input
    onInputChange?: (value: string) => void;

    // Callback to call when user selects an item from the autocomplete dropdown
    onSelect?: (value: string, item?: {}) => void;

    // Text to display in input when no user input
    placeholderText?: string;

    // Custom render function for items in the menu
    renderItem?: (item: {}, isHighlighted?: boolean, styles?: {}) => JSX.Element;

    // Custom menu rendering for autocomplete results
    renderMenu?: (items: Array<{}>, value?: string, styles?: {}) => JSX.Element;

    // Sort function to use to order items in the drop-down
    sortItems?: (itemA: {}, itemB: {}, value: string) => -1 | 0 | 1;
}

// Props which react-autcomplete passes to renderInput() prop/callback
interface ReactAutocompleteInputProps {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    role: string;
    ref: (ref: HTMLInputElement) => void;
    value: string;
}

const defaultRenderItem = (item: string, isHighlighted?: boolean): JSX.Element => {
    return (
        <div
            key={item}
            className={buildClassString({
                autocomplete__item: true,
                active: isHighlighted
            })}
        >
            {item}
        </div>
    );
};

const defaultRenderMenu = (items: Array<{}>): JSX.Element => {
    if (items && items.length > 0) {
        return <div className="autocomplete__menu">{items}</div>;
    } else {
        return <div />;
    }
};

class AutoComplete extends React.Component<AutoCompleteProps, {}> {
    static defaultProps: {} = {
        clearSearchOnSelect: true,
        setValueOnSelect: false,
        renderItem: defaultRenderItem,
        renderMenu: defaultRenderMenu
    };

    private _searchInputRef: SearchInput;

    constructor(props: AutoCompleteProps) {
        super(props);
        this._onItemSelect = this._onItemSelect.bind(this);
    }

    render(): JSX.Element {
        const {
            getItemValue,
            items,
            placeholderText,
            renderItem,
            renderMenu,
            sortItems } = this.props;

        const renderInput = (props: ReactAutocompleteInputProps) => this._renderInput(props);

        // NOTE: nulling out wrapperStyle is needed else ReactAutoComplete
        // will make the autocomplete div inline-block
        return (
            <ReactAutocomplete
                getItemValue={getItemValue}
                items={items}
                inputProps={{ placeholder: placeholderText }}
                onSelect={this._onItemSelect}
                renderInput={renderInput}
                renderItem={renderItem}
                renderMenu={renderMenu}
                sortItems={sortItems}
                wrapperProps={{className: 'autocomplete'}}
                wrapperStyle={null}
            />
        );
    }

    // Handle selection of item in autocomplete
    // This wrapper exists to clear the search input on selection, if
    // specified -- otherwise it just passes through to the provided callback
    private _onItemSelect(value: string, item?: {}): void {
        const { clearSearchOnSelect, setValueOnSelect, onSelect } = this.props;
        if (clearSearchOnSelect) {
            this._searchInputRef.clear();
        } else if (setValueOnSelect) {
            this._searchInputRef.setValue(value);
        }

        if (onSelect) {
            onSelect(value, item);
        }
    }

    // Render a custom input control with an icon and a 'clear' button.
    // If it's ever desired to extend the AutoComplete to support just a vanilla
    // input element, one can add a prop and conditionally pass this method in
    // (but note the slightly different signature for onChange)
    private _renderInput(props: ReactAutocompleteInputProps): JSX.Element {
        const {
            onBlur,
            onClick,
            onFocus,
            onKeyDown,
            placeholder,
            ref,
            role } = props;
        const { onInputChange } = this.props;

        return (
            <SearchInput
                inputRef={ref}
                inputRole={role}
                onBlur={onBlur}
                onChange={onInputChange}
                onClick={onClick}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                placeholderText={placeholder}
                ref={elt => this._searchInputRef = elt}
            />
        );
    }
}

export { AutoComplete };
export default AutoComplete;
