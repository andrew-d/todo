import React from 'react';

import './styles.scss';


export default class TodoListMenuItem extends React.Component {
  static propTypes = {
    name:           React.PropTypes.string.isRequired,
    totalItems:     React.PropTypes.number,
    completedItems: React.PropTypes.number,
    onClick:        React.PropTypes.func,

    // TODO: active item
  }

  render() {
    let span;
    if( this.props.totalItems && this.props.completedItems ) {
      span = (
        <span key='badge' className="badge">
          {this.props.completedItems} / {this.props.totalItems}
        </span>
      );
    } else if( this.props.totalItems ) {
      span = <span key='badge' className="badge">{this.props.totalItems}</span>;
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

    return (
      <a className='TodoListMenuItem list-group-item' {...props}>
        {span}
        {this.props.name}
      </a>
    );
  }
}
