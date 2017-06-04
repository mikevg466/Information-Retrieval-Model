import React, {Component} from 'react';
import store from '../store';
import Search from '../components/Search';
import {connect} from 'react-redux'

import {search} from '../action-creators/search';

class SearchContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { artistQuery: '', songQuery: ''};

    this.handleArtistInput = this.handleArtistInput.bind(this);
    this.handleSongInput = this.handleSongInput.bind(this);
  }

  handleArtistInput(artist) {
    this.setState({ artistQuery: artist });
  }

  handleSongInput(song) {
    this.setState({ songQuery: song });
  }

  render() {
    return (
      <Search
        {...this.props}
        {...this.state}
        setArtist={this.handleArtistInput}
        setSong={this.handleSongInput}
        handleSubmit={this.props.handleSubmit} />
    );
  }
}

const mapStateToProps = (state, ownProps) => (state)

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSubmit: (e, artistQ, songQ) => {
    e.preventDefault();
    if (artistQ && songQ) {
      return dispatch(search(artistQ))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
