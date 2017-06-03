import React, {Component} from 'react';
import store from '../store';
import Lyrics from '../components/Lyrics';
import {connect} from 'react-redux'

import {searchLyrics} from '../action-creators/lyrics';

class LyricsContainer extends Component {

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
      <Lyrics
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
      return dispatch(searchLyrics(artistQ, songQ))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(LyricsContainer)
