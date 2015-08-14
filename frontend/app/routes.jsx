import React from 'react';
import { Redirect, Route } from 'react-router';

// Require routes
import About from './pages/About';
import App from './pages/App';
import Home from './pages/Home';


const routes = (
  <Route component={App}>
    {/* Home page */}
    <Route path='home' component={Home} />

    {/* About page */}
    <Route path='about' component={About} />

    <Redirect from='/' to='/home' />
  </Route>
);


export default routes;
