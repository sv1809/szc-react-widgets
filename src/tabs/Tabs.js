import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import helpers from '../helpers';

export default class Tabs extends Component {
    static propTypes = {
        selected: React.PropTypes.number,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    }

    state = {
        selected: this.props.selected || 0
    }

    handleClick = (index, event) => {
        event.preventDefault();
        this.setState({
            selected: index
        });
    }

    renderTitles = () => {
        function labels(child, index) {
            const tabClass = classnames(helpers.cssPrefix + 'tab-header__text', this.state.selected === index ? helpers.cssPrefix + 'tab-header__text--active' : '');
            return (
                <li key={index} className={helpers.cssPrefix + 'tab-header'}>
                    <a href="#"
                        className={tabClass}
                        onClick={this.handleClick.bind(this, index)}>
                        {child.props.label}
                    </a>
                </li>
            );
        }
        return (
            <ul className={helpers.cssPrefix + 'tabs-labels'}>
                {this.props.children.map(labels.bind(this))}
            </ul>
        );
    }

    renderContent = () => {
        return (
            <div className={helpers.cssPrefix + 'tabs-content'}>
                {this.props.children[this.state.selected]}
            </div>
        );
    }

    render() {
        return (
            <div className={helpers.cssPrefix + 'tabs'}>
                {this.renderTitles()}
                {this.renderContent()}
            </div>
        );
    }
};