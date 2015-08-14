import React from 'react';

import './styles.scss';


export default class TodoList extends React.Component {
  static propTypes = {
    listName: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className='TodoList list-group'>
        <a className='list-group-item active header' key='header'>
          <h4>{this.props.listName}</h4>
        </a>

        {this.props.children}
      </div>
    );
  }
}
