import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import size from 'lodash-node/modern/collection/size';

import { fetchTodos } from '../actions/todos';
import { fetchLists } from '../actions/lists';
import { selectList } from '../actions/ui';
import ProgressBar from '../components/ProgressBar';
import TodoList from '../components/TodoList';
import TodoListItem from '../components/TodoListItem';
import TodoListMenu from '../components/TodoListMenu';
import TodoListMenuItem from '../components/TodoListMenuItem';


class Home extends React.Component {
  static propTypes = {
    todos:        React.PropTypes.array.isRequired,
    lists:        React.PropTypes.object.isRequired,
    list:         React.PropTypes.object,
    selectedList: React.PropTypes.number,

    fetchTodos: React.PropTypes.func.isRequired,
    fetchLists: React.PropTypes.func.isRequired,
    selectList: React.PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchLists();
    this.props.fetchTodos();
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-3'>
          {this.renderMenu()}
        </div>

        <div className='col-md-9'>
          {this.renderTodoList()}
        </div>
      </div>
    );
  }

  renderMenu() {
    const menuItems = Object.values(this.props.lists);

    const renderedItems = menuItems.map((item) => (
      // TODO: active item?
      <TodoListMenuItem
        key={`menu-item-${item.id}`}
        name={item.name}
        totalItems={10}
        completedItems={5}
        onClick={this.handleSelectList.bind(this, item.id)}
      />
    ));

    return (
      <TodoListMenu>
        {renderedItems}
      </TodoListMenu>
    );
  }

  renderTodoList() {
    if( !this.props.list ) return <div>No Such List</div>;

    const renderedItems = this.props.todos.map((item) => (
      <TodoListItem
        key={`todo-item-${item.id}`}
        text={item.text}
        complete={item.complete}
      />
    ));

    // Calculate finished percentage.
    const finishedItems = this.props.todos.filter(i => i.complete).length,
      finishedPercent = (finishedItems / this.props.todos.length) * 100.0;

    return [
      <TodoList key='list' listName={this.props.list.name}>
        {renderedItems}
      </TodoList>,
      <ProgressBar key='progress' percent={finishedPercent} />,
    ];
  }

  handleSelectList(id) {
    this.props.selectList(id);
  }
}


function mapState(state) {
  return {
    lists:        state.data.lists,
    todos:        state.data.todos,
    selectedList: state.ui.main.selectedList,
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchTodos,
    fetchLists,
    selectList,
  }, dispatch);
}


function mergeProps(state, actions, props) {
  const currId = state.selectedList;

  return Object.assign({}, props, {
    todos:        Object.values(state.todos).filter(item => item.list_id === currId),
    list:         state.lists[currId] || null,
    lists:        state.lists,
    selectedList: state.selectedList,

    ...actions,
  });
}


export default connect(mapState, mapDispatch, mergeProps)(Home);
