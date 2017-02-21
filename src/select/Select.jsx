import * as React from 'react';
import helpers from '../helpers';
import classnames from 'classnames';

class Select extends React.Component {

    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
        value: React.PropTypes.any,
        name: React.PropTypes.string,
        idField: React.PropTypes.string,
        textField: React.PropTypes.string,
        nullable: React.PropTypes.bool,
        separator: React.PropTypes.string,
        multiple: React.PropTypes.bool,
        onSelect: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        searchPlaceholder: React.PropTypes.string,
        searchable: React.PropTypes.bool,
    };

    state = {
        searchText: '',
        items: this.props.items
    }

    listVisibleClass = `${helpers.cssPrefix}select-list--visible`;

    componentDidMount = () => {
    }

    componentWillMount = () => {
    }

    handleChange(item) {
        if (this.props.onSelect) {
            this.props.onSelect(item)
        }
        this.hideList();
    }

    getKey(item) {
        if (item == null) {
            return '';
        }
        return this.props.idField ? item[this.props.idField] : item;
    }

    getText(item) {
        if (item == null) {
            return '';
        }
        return item[this.props.textField] ? item[this.props.textField] : item;
    }

    showList() {
        if (!this.list) {
            return;
        }
        this.setState({
            searchText: ''
        })
        let inputPosition = this.input.getBoundingClientRect(),
            inputTop = inputPosition.top,
            inputLeft = inputPosition.left,
            inputHeight = this.input.offsetHeight;
        this.list.style.top = `${inputTop + inputHeight}px`;
        this.list.style.left = `${inputLeft + 1}px`;
        this.list.style.width = `${this.input.offsetWidth - 2}px`;
        this.input.style.borderBottomLeftRadius = 0;
        this.input.style.borderBottomRightRadius = 0;
        this.list.classList.add(this.listVisibleClass);
        document.addEventListener('mousedown', this.onDocumentMouseDown);
        if (this.searchInput) {
            this.searchInput.focus()
        }
        this.setScrollEnabled(false);
    }

    hideList() {
        this.iFa.classList.remove(`${helpers.cssPrefix}select-item__i--up`);
        this.list.classList.remove(this.listVisibleClass);
        this.input.style.borderBottomLeftRadius = null;
        this.input.style.borderBottomRightRadius = null;
        document.removeEventListener('mousedown', this.onDocumentMouseDown);
        this.setScrollEnabled(true);
    }

    setScrollEnabled(enabled) {
        let el = this.element.parentElement;
        while (el) {
            if (enabled) {
                document.removeEventListener('wheel', this.preventParentScroll);
                document.removeEventListener('touchmove', this.preventDefault);
                document.removeEventListener('keydown', this.preventDefault);
            } else {
                document.addEventListener('wheel', this.preventParentScroll);
                document.addEventListener('touchmove', this.preventDefault);
                document.addEventListener('keydown', this.preventDefault);
            }
            el = el.parentElement;
        }
    }

    preventParentScroll = (e) => {
        let needPrevent = true;
        let el = e.target;
        while (el) {
            if (el === this.options) {
                needPrevent = false;
            }
            el = el.parentElement;
        }
        if (e.deltaY == 0 || needPrevent) {
            e.preventDefault();
        }
        if (e.deltaY < 0 && this.options.scrollTop == 0) {
            e.preventDefault();
        } else {
            if (e.deltaY > 0 && (this.options.scrollTop == this.options.scrollHeight - this.options.clientHeight)) {
                e.preventDefault();
            }
        }
    }

    preventDefault = (e) => {
        let el = e.target;
        while (el) {
            if (el === this.list) {
                return;
            }
            el = el.parentElement;
        }
        if (e.type === 'keydown') {
            let keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
            e.preventDefault();
            return false;
        } else {
            e.preventDefault();
            e.returnValue = false;
        }
    }

    onDocumentMouseDown = (e) => {
        let el = e.target;
        while (el !== null) {
            if (el === this.list || el === this.input || el === this.iFa) {
                return;
            }
            el = el.parentElement;
        }
        this.hideList()
    }

    showHideList() {
        if (!this.list) {
            return;
        }
        let isListVisible = this.list.classList.contains(this.listVisibleClass);
        if (isListVisible) {
            this.hideList();
        } else {
            this.iFa.classList.add(`${helpers.cssPrefix}select-item__i--up`);
            this.showList();
        }
    }

    onInputClick = () => {
        this.showHideList();
    }

    onSearchInput = (e) => {
        if (this.props.onSearchInput) {
            this.props.onSearchInput(e.target.value);
        }
        this.setState({
            searchText: e.target.value,
            items: this.getFilteredItems(this.props.items, e.target.value)
        })
    };

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            items: this.getFilteredItems(nextProps.items, this.state.searchText)
        })
    }

    getFilteredItems(items, text) {
        if (!items || !items.length) {
            return null;
        }
        if (this.props.onSearchInput) {
            return items;
        }
        let searchRegExp = new RegExp(text, 'i');
        return items.filter((item) => {
            const itemText = this.getText(item);
            if (text.length) {
                return searchRegExp.test(itemText);
            } else {
                return true;
            }
        })
    }

    render() {
        return (<div ref={(el) => this.element = el}>
            {this.getElement()}
            {this.getList()}
        </div>);
    }

    getElement() {
        const className = classnames(`${helpers.cssPrefix}select-item`);
        const inputClassName = classnames(`${helpers.cssPrefix}select-item__input`);
        const iClassName = classnames(`${helpers.cssPrefix}select-item__i`);
        return (<div className={className}>
            {this.getInput()}
            <i ref={(el) => this.iFa = el} className={iClassName} id={this.iId} onClick={this.onInputClick}></i>
            <input onChange={this.onInput} onClick={this.onInputClick} onFocus={this.onInputFocus}
                onBlur={this.onInputBlur} onKeyUp={this.onInputKeyUp} onKeyDown={this.onInputKeyDown}
                ref={(el) => this.input = el} placeholder={this.props.placeholder}
                value={this.getText(this.props.value)}
                readOnly={true} className={inputClassName} />
        </div>);
    }

    getInput() {
        const inputStyle = {
            display: 'none',
        };
        const inputValue = this.props.multiple ? this.props.value.map(item => this.getKey(item)).join(this.props.separator) : this.getKey(this.props.value);
        return (<input name={this.props.name} style={inputStyle} value={inputValue} readOnly={true} />)
    }

    getList() {
        const listClass = classnames(`${helpers.cssPrefix}select-list`);
        const itemClass = classnames(`${helpers.cssPrefix}select-list__item`);
        const emptyItem = classnames(itemClass, `${helpers.cssPrefix}select-list__item--empty`);
        const list = this.state.items && this.state.items.map(item => (<div key={this.getKey(item)} onClick={this.handleChange.bind(this, item)} className={itemClass}>{this.getText(item)}</div>));
        // if (this.props.nullable) {
        //     list.unshift(<div key='null' onClick={this.handleChange.bind(this, null)} className={emptyItem}>{this.getText(null)}</div>)
        // }
        const res = (<div className={listClass} ref={(el) => this.list = el}>
            {this.props.searchable && this.getSearchInput()}
            <div className={classnames(`${helpers.cssPrefix}select-list-options`)} ref={(el) => this.options = el}>
                {list}
            </div>
        </div>)
        return res;
    }

    getSearchInput() {
        return <div className={`${helpers.cssPrefix}select-list-search`}>
            <input onChange={this.onSearchInput} ref={(el) => this.searchInput = el} value={this.state.searchText}
                className={`${helpers.cssPrefix}select-list-search__input`}
                placeholder={this.props.searchPlaceholder} />
        </div>
    }
}

export default Select;