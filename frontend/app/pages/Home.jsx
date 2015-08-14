import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash-node/modern/collection/size';

import { fetchTodos } from '../actions/todos';
import { fetchLists } from '../actions/lists';
import TodoList from '../components/TodoList';
import TodoListItem from '../components/TodoListItem';
import TodoListMenu from '../components/TodoListMenu';
import TodoListMenuItem from '../components/TodoListMenuItem';


class Home extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchLists());
    this.props.dispatch(fetchTodos());
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-3'>
          {this.renderMenu()}
        </div>

        <div className='col-md-9'>
          {this.renderTodoListFor(0 /* TODO */)}
        </div>
      </div>
    );
  }

  renderMenu() {
    const menuItems = [
      {id: 1, name: 'Main List'},
      {id: 2, name: 'Other List 1'},
      {id: 3, name: 'Other List 2'},
    ];

    const renderedItems = menuItems.map((item) => (
      <TodoListMenuItem
        key={`menu-item-${item.id}`}
        name={item.name}
        totalItems={10}
        completedItems={5}
      />
    ));

    return (
      <TodoListMenu>
        {renderedItems}
      </TodoListMenu>
    );
  }

  renderTodoListFor(id) {
    // TODO:
    const listItems = [
      {id: 1, text: 'Item One', complete: false},
      {id: 2, text: 'Item Two', complete: false},
      {id: 3, text: 'Item Three', complete: true},
    ];

    const renderedItems = listItems.map((item) => (
      <TodoListItem
        key={`todo-item-${item.id}`}
        text={item.text}
        complete={item.complete}
      />
    ));

    // Calculate finished percentage.
    const finishedItems = listItems.filter(i => i.complete).length,
          finishedPercent = (finishedItems / listItems.length) * 100.0,
          finishedString = finishedPercent.toFixed(2) + '%';

    // TODO: make a component
    const progressBar = (
      <div key='progress' className="progress">
        <div
          className="progress-bar progress-bar-success"
          role="progressbar"
          aria-valuenow="20"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{width: finishedString}}
        >
          <span>{finishedString} Complete</span>
        </div>
      </div>
    );


    return [
      <TodoList key='list' listName='Main TODO List'>
        {renderedItems}
      </TodoList>,
      progressBar,
    ];
  }
}


export default connect(state => ({
  todos: state.todos,
}))(Home);
