import React, {Component} from 'react';
import store from '../store';
import Search from '../components/Search';
import {connect} from 'react-redux'

import {booleanSearch} from '../action-creators/search';

class SearchContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };

    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(query) {
    this.setState({ searchQuery: query });
  }

  render() {
    return (
      <Search
        {...this.props}
        {...this.state}
        setSearchQuery={this.handleSearchInput}
        handleSubmit={this.props.handleSubmit} />

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
