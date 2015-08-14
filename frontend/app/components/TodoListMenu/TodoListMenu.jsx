import React from 'react';

import './styles.scss';


export default class TodoListMenu extends React.Component {
  static propTypes = {
    // TODO: children
    // TODO: active list index?
  }

  render() {
    return (
      <div className='TodoListMenu list-group'>
        {this.props.children}
      </div>
    );
  }
}
