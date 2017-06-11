import React, {Component} from 'react';
import store from '../store';
import Search from '../components/Search';
import {connect} from 'react-redux'

import { booleanSearch, vectorSearch, setRelevancy, updateRelevancy } from '../action-creators/search';

class SearchContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { searchQuery: '', searchFunc: () => {}, title: '' };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setBoolFunc = this.setBoolFunc.bind(this);
    this.setVectorFunc = this.setVectorFunc.bind(this);
  }

  handleSearchInput(query) {
    this.setState({ searchQuery: query });
  }

  setBoolFunc(){
    this.setState({ searchFunc: booleanSearch, title: 'Boolean Search' });
    this.props.changeRelevancy(false);
  }

  setVectorFunc(){
    this.setState({ searchFunc: vectorSearch, title: 'Vector Search' });
    this.props.changeRelevancy(false);
  }

  render() {
    return (
      <div>
        <div className="row">
        <nav className="navbar navbar-default">
          <div className="col-md-3 col-xs-12" onClick={this.setBoolFunc}>
            <p>
              <span className="navbar-link">Boolean Search!</span>
            </p>
          </div>
          <div className="col-md-3 col-xs-12" onClick={this.setVectorFunc}>
            <p>
              <span className="navbar-link">Vector Search!</span>
            </p>
          </div>
          <div className="col-md-3 col-xs-12" onClick={() => this.props.changeRelevancy(true)}>
            <p>
              <span className="navbar-link">Add Relevancy!</span>
            </p>
          </div>
          <div className="col-md-3 col-xs-12">
          </div>
        </nav>
        </div>
        <Search
          {...this.props}
          {...this.state}
          setSearchQuery={this.handleSearchInput}
          handleSubmit={this.props.handleSubmit}
          updateRelevancy={this.props.updateRelevancy} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => (state);

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSubmit: (e, searchQ, searchFunc) => {
    e.preventDefault();
    if (searchQ) {
      return dispatch(searchFunc(searchQ))
    }
  },
  changeRelevancy: (relevancy) => {
    return dispatch(setRelevancy(relevancy));
  },
  updateRelevancy: (searchQ, page) => {
    return dispatch(updateRelevancy(searchQ, page));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
