// This must come first, in this order
import 'ie8';
import 'html5shiv/dist/html5shiv';
import 'html5shiv/dist/html5shiv-printshiv';
import 'babel/polyfill';
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

// Import vendor styles here.
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

// Render the app.
import Root from './Root';
import createHistory from 'history/lib/createHashHistory';

const history = createHistory();
ReactDOM.render(<Root history={history} />, document.getElementById('app'));
