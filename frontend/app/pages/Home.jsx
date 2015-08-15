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
          {this.renderTodoListFor(1 /* TODO */)}
        </div>
      </div>
    );
  }

  renderMenu() {
    const menuItems = Object.values(this.props.lists);

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
    if( !this.props.lists[id] ) return <div>No Such List</div>;

    // Get all Todos in this list.
    const listItems = Object.values(this.props.todos).filter(item => item.list_id === id);

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
      <TodoList key='list' listName={this.props.lists[id].name}>
        {renderedItems}
      </TodoList>,
      progressBar,
    ];
  }
}


export default connect(state => ({
  lists: state.data.lists,
  todos: state.data.todos,
}))(Home);
