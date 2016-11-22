import * as React from 'react';
import helpers from '../helpers';
import classnames from 'classnames';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        }
    }

    componentDidMount() {
    }

    componentWillMount() {
    }

    handleChange(item) {
        if (this.props.onSelect) {
            this.props.onSelect(item)
        }
    }

    getKey(item) {
        if (item == null) {
            return '';
        }
        return item[this.props.idField];
    }

    getText(item) {
        if (item == null) {
            return '';
        }
        return item[this.props.textField] == null ? '' : item[this.props.textField];
    };

    render() {
        return (<div>
            {this.getInput()}
            <label>{this.getText(this.props.value)}</label>
            {this.getList()}
        </div>);
    }

    getInput() {
        const inputStyle = {
            // display: 'none',
        },
            inputValue = this.props.multiple ? this.props.value.map(item => this.getKey(item)).join(this.props.separator) : this.getKey(this.props.value);
        return (<input name={this.props.name} style={inputStyle} value={inputValue} readOnly={true} />)
    }

    getList() {
        const listClass = classnames(`${helpers.cssPrefix}select-list`),
            itemClass = classnames(`${helpers.cssPrefix}select-list__item`),
            emptyItem = classnames(itemClass, `${helpers.cssPrefix}select-list__item--empty`),
            list = this.props.items.map(item => (<div key={this.getKey(item)} onClick={this.handleChange.bind(this, item)} className={itemClass}>{this.getText(item)}</div>));
        if (this.props.nullable) {
            list.unshift(<div key='null' onClick={this.handleChange.bind(this, null)} className={emptyItem}>{this.getText(null)}</div>)
        }
        const res = (<div className={listClass}>
            {list}
        </div>)
        return res;
    }
}

Select.propTypes = {
    items: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
    value: React.PropTypes.any,
    name: React.PropTypes.string,
    idField: React.PropTypes.string,
    textField: React.PropTypes.string,
    nullable: React.PropTypes.bool,
    separator: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func
}

export default Select;