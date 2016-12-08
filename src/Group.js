import React, { PropTypes, Component } from 'react';
import Collapse from 'react-collapse';
import classnames from 'classnames';

import helpers from './helpers';

export default class Group extends Component {
    static propTypes = {
        caption: PropTypes.string,
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
        expanded: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            expanded: !!props.expanded
        }
    }

    state = {
        expanded: false,
    }

    showHideContent = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.expanded != null && nextProps.expanded != this.state.expanded) {
            this.setState({
                expanded: nextProps.expanded
            })
        }
    }

    render() {
        const iconClass = classnames(helpers.cssPrefix + 'group-caption__icon', this.state.expanded ? helpers.cssPrefix + 'group-caption__icon--expanded' : '');
        return (<div className={helpers.cssPrefix + 'group'}>
            <div onClick={this.showHideContent} className={helpers.cssPrefix + 'group-caption'}>
                <i className={iconClass} />
                <label className={helpers.cssPrefix + 'group-caption__text'}>
                    {this.props.caption}
                </label>
            </div>
            <Collapse isOpened={this.state.expanded}>
                <div className={helpers.cssPrefix + 'group-content'}>
                    {this.props.children}
                </div>
            </Collapse>
        </div>)
    }
}