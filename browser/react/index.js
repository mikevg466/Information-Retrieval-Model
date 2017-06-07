import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRedirect, IndexRoute, Link} from 'react-router';

import SearchContainer from './containers/SearchContainer';

import App from './components/App';
import Search from './components/Search';

import axios from 'axios';
import store from './store';
import {Provider} from 'react-redux';
import {setFunction, booleanSearch} from './action-creators/search';

const setFunc = (selectedFunc) => store.dispatch(setFunction(selectedFunc));

ReactDOM.render(
  <Provider store={store} >
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/search" component={SearchContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
