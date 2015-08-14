import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash-node/modern/collection/size';

import { fetchTodos } from '../actions/todos';


class Home extends React.Component {
  componentWillMount() {
	this.props.dispatch(fetchTodos());
  }

  render() {
    return (
      <div>
        <h1>ToDo</h1>

        <p>This is the home page.  We have {size(this.props.todos)} todos.</p>
      </div>
    );
  }
}


export default connect(state => ({
  todos: state.todos,
}))(Home);
