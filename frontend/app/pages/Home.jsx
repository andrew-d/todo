import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash-node/modern/collection/size';

import { fetchTodos } from '../actions/todos';
import TodoList from '../components/TodoList';
import TodoListItem from '../components/TodoListItem';
import TodoListMenu from '../components/TodoListMenu';
import TodoListMenuItem from '../components/TodoListMenuItem';


class Home extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchTodos());
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-3'>
          <TodoListMenu>
            <TodoListMenuItem
              name='Main List'
              totalItems={10}
              completedItems={4}
            />
            <TodoListMenuItem
              name='Other List 1'
              totalItems={3}
              completedItems={2}
            />
            <TodoListMenuItem
              name='Other List 2'
              totalItems={12}
            />
          </TodoListMenu>
        </div>

        <div className='col-md-9'>
          <TodoList listName='Main TODO List'>
            <TodoListItem text='Item One' />
            <TodoListItem text='Item Two' />
            <TodoListItem text='Item Three' />
            <TodoListItem text='Item Four' />
            <TodoListItem text='Finished Item' complete={true} />
          </TodoList>

          <div className="progress">
            <div
              className="progress-bar progress-bar-success"
              role="progressbar"
              aria-valuenow="20"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{width: '20%'}}
            >
              <span>20% Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(state => ({
  todos: state.todos,
}))(Home);
