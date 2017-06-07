import React, {Component} from 'react';
import store from '../store';
import Search from '../components/Search';
import {connect} from 'react-redux'

import {booleanSearch} from '../action-creators/search';

class SearchContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { searchQuery: '', searchFunc: () => {} };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setBoolFunc = this.setBoolFunc.bind(this);
  }

  handleSearchInput(query) {
    this.setState({ searchQuery: query });
  }

  setBoolFunc(){
    this.setState({ searchFunc: booleanSearch });
  }

  render() {
    return (
      <div>
        <div className="row">
        <nav className="navbar navbar-default">
          <div className="col-md-4 col-xs-12" onClick={this.setBoolFunc}>
            <p>
              <span className="navbar-link">Boolean Search!</span>
            </p>
          </div>
          <div className="col-md-4 col-xs-12">
          </div>
          <div className="col-md-4 col-xs-12">
          </div>
        </nav>
        </div>
        <Search
          {...this.props}
          {...this.state}
          setSearchQuery={this.handleSearchInput}
          handleSubmit={this.props.handleSubmit} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => (state)

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSubmit: (e, searchQ, searchFunc) => {
    e.preventDefault();
    if (searchQ) {
      return dispatch(searchFunc(searchQ))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
