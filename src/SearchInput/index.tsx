import * as React from 'react';
import { buildClassString } from '../StringUtils';
import './style/index.scss';

const maxSearchLength = 50;

export interface SearchInputProps {
    clearOnEscape?: boolean;                                   // whether or not to clear the input if esc pressed
                                                               // (default: true)
    inputRef?: (ref: HTMLInputElement) => void;                // callback to get the ref to the underlying input
    inputRole?: string;                                        // role to pass to input element
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;  // called when input element is blurred
    onChange?: (value: string) => void;                        // called when text input changes
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void; // called when input element is clicked on
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void; // called when input element is given focus
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // called on keydown in input
    placeholderText?: string;                                  // placeholder text to display in input
}

export interface SearchInputState {
    value: string;    // Controlled component -- current text typed into the input
}

class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
    // tslint:disable-next-line no-unused-variable
    private static defaultProps: SearchInputProps = {
        clearOnEscape: true
    };

    private _inputRef: HTMLInputElement;

    constructor(props: SearchInputProps) {
        super(props);

        this.state = Object.assign({}, this.state, { value: '' });
        this.focus = this.focus.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    clear(): void {
        this._updateValue('');
    }

    setValue(txt: string): void {
        this._updateValue(txt);
    }

    focus(): void {
        if (this._inputRef) {
            this._inputRef.focus();
        }
    }

    render(): JSX.Element {
        const {
            inputRef,
            inputRole,
            onBlur,
            onClick,
            onFocus,
            placeholderText
        } = this.props;
        const { value } = this.state;

        const clearButtonClass = buildClassString({
          'search-input__clear-btn': true,
          'hidden': !value
        });

        return (
            <div
                className="pxl-form-control search-input"
                onClick={this.focus}
                onMouseDown={this._onMouseDown}
            >
                <i className="icon-search" aria-hidden="true" />
                <input
                    autoComplete="off"
                    className="search-input__input"
                    placeholder={placeholderText}
                    ref={ref => {
                        this._inputRef = ref;
                        if (inputRef) { inputRef(ref); }
                    }}
                    role={inputRole}
                    type="text"
                    onBlur={onBlur}
                    onClick={onClick}
                    onChange={this._onChange}
                    onFocus={onFocus}
                    onKeyDown={this._onKeyDown}
                    maxLength={maxSearchLength}
                    value={value}
                />
                <button
                    className={clearButtonClass}
                    onClick={this._onClearSearch}
                >
                    <i className="search-input__clear-icon icon-cancel" />
                </button>
            </div>
        );
    }

    private _onClearSearch(e: React.MouseEvent<HTMLElement>): void {
        this._updateValue('');
    }

    private _onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const searchString = e && e.target ? e.target.value.substr(0, maxSearchLength) : '';
        this._updateValue(searchString);
    }

    // Callback to handle mouseDown events on the search container
    private _onMouseDown(e: React.MouseEvent<HTMLElement>): void {
        if (e.target !== this._inputRef) {
            // focus gets blurred on mouse down, so preventDefault
            // to avoid losing focus on the input
            e.preventDefault();
        }
    }

    private _onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        const { clearOnEscape, onKeyDown } = this.props;
        if (onKeyDown) {
            onKeyDown(e);
        }

        // on escape, clear search input and give up focus
        if (!e.isDefaultPrevented() && e.key === 'Escape' && clearOnEscape) {
            this.clear();
            if (this._inputRef) {
                this._inputRef.blur();
            }
        }
    }

    // Update text shown in input based on user interaction (keypress, etc) and
    // notify owner of new value if callback provided
    private _updateValue(newValue: string): void {
        const { onChange } = this.props;
        const { value } = this.state;

        if (newValue === value) {
            // no-op if no change
            return;
        }

        this.setState({ value: newValue });
        if (onChange) {
            onChange(newValue);
        }
    }
}

export { SearchInput };
export default SearchInput;
