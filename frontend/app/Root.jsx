import React from 'react';

import { Router } from 'react-router';

import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducers';


// In production, we want to use just the middleware.
// In development, we want to use some store enhancers from redux-devtools.
// UglifyJS will eliminate the dead code depending on the build environment.
let createStoreWithMiddleware;

if (process.env.NODE_ENV === 'production') {
  createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
  )(createStore);
} else {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware),
    require('redux-devtools').devTools(),
    require('redux-devtools').persistState(
      window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    ),
    createStore
  );
}

// Build final store.
const store = createStoreWithMiddleware(reducer, {});


// The main application class.
export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <Provider store={store}>
        {() => renderRoutes(this.props.history)}
      </Provider>
    );
  }
}


import routes from './routes';
function renderRoutes(history) {
  let children = [
    <Router history={history} key="router">
      {routes}
    </Router>
  ];

  if (process.env.NODE_ENV !== 'production') {
    const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

    // We use this to reset the z-index of the component so it shows 'over' the
    // navbar.
    const getDefaultStyle = require('redux-devtools/lib/react/DebugPanel').getDefaultStyle;
    const getStyle = (props) => Object.assign({}, getDefaultStyle(props), {zIndex: 9999});

    children.push(
      <DebugPanel top right bottom key="debugPanel" getStyle={getStyle}>
        <DevTools store={store} monitor={LogMonitor}/>
      </DebugPanel>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}
