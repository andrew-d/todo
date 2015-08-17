import React from 'react';
import cx from 'classnames';

import './styles.scss';


export default class TodoListMenuItem extends React.Component {
  static propTypes = {
    name:           React.PropTypes.string.isRequired,
    active:         React.PropTypes.bool,
    totalItems:     React.PropTypes.number,
    completedItems: React.PropTypes.number,
    onClick:        React.PropTypes.func,
  }

  static defaultProps = {
    active: false,
  }

  render() {
    let span;
    if( this.props.totalItems && this.props.completedItems ) {
      span = (
        <span key='badge' className='badge'>
          {this.props.completedItems} / {this.props.totalItems}
        </span>
      );
    } else if( this.props.totalItems ) {
      span = <span key='badge' className='badge'>{this.props.totalItems}</span>;
    } else {
      span = null;
    }

    // Additional properties.
    let props = {};
    ['onClick'].forEach((prop) => {
      if( this.props[prop] ) {
        props[prop] = this.props[prop];
      }
    });

    // Classes
    const classes = cx({
      'TodoListMenuItem': true,
      'list-group-item': true,
      'active': this.props.active,
    });

    return (
      <a className={classes} {...props}>
        {span}
        {this.props.name}
      </a>
    );
  }
}
