import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRedirect, IndexRoute} from 'react-router';

import SearchContainer from './containers/SearchContainer';

import App from './components/App';
import Search from './components/Search';

import axios from 'axios';
import store from './store';
import {Provider} from 'react-redux';

ReactDOM.render(
  <Provider store={store} >
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/search" component={SearchContainer} />
        <IndexRedirect to="/search" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
