import React, {Component} from 'react';
import {setFunction, booleanSearch} from '../action-creators/search';
import store from '../store';
import {Link} from 'react-router';
const setBoolFunc = () => store.dispatch(setFunction(booleanSearch));

export default function App ({ children }) {
  return (
    <div id="main" className="container-fluid">
      <div className="col-xs-12">
        <div className="row">
          <div className="col-md-4 col-xs-12" onClick={setBoolFunc}>
            <Link to="/search">
              Boolean Search
            </Link>
          </div>
          <div className="col-md-4 col-xs-12">
          </div>
          <div className="col-md-4 col-xs-12">
          </div>
        </div>
        { children }
      </div>
    </div>
  );
}
