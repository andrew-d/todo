import React from 'react';
import cx from 'classnames';

import './styles.scss';


export default class TodoListItem extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    complete: React.PropTypes.bool,
  }

  render() {
    const className = cx({
      'TodoListItem':    true,
      'list-group-item': true,
      'complete':        this.props.complete,
    });

    return (
      <a className={className}>
        {this.props.text}
      </a>
    );
  }
}
