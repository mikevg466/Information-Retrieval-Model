import React, {Component} from 'react';

export default function App ({ children }) {
  return (
    <div id="main" className="container-fluid">
      <div className="col-xs-12">
        { children }
      </div>
    </div>
  );
}
