import React from 'react';

import './styles.scss';


export default class TodoListMenuItem extends React.Component {
  static propTypes = {
    name:           React.PropTypes.string.isRequired,
    totalItems:     React.PropTypes.number,
    completedItems: React.PropTypes.number,

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

    return (
      <a className='TodoListMenuItem list-group-item'>
        {span}
        {this.props.name}
      </a>
    );
  }
}
