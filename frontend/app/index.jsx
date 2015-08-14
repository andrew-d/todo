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
import HashHistory from 'react-router/lib/HashHistory';

const history = new HashHistory();
ReactDOM.render(<Root history={history} />, document.getElementById('app'));
