import AUDIO from '../audio';
import React from 'react';
import {previous, next, setProgress, toggleSong} from '../action-creators/player';
import Player from '../components/Player';
import {connect} from 'react-redux';

class PlayerContainer extends React.Component{
  componentDidMount(){
    AUDIO.addEventListener('ended', () => this.props.next());
    AUDIO.addEventListener('timeupdate', () => this.props.setProgress(AUDIO.currentTime / AUDIO.duration));
  }
  render(){
    return (
      <Player {...this.props} />
    )
  }
}

const mapStateToProps = (state, ownProps) => state.player;

const mapDispatchToProps = (dispatch, ownProps) => {
  return ({
    setProgress: (progress) => dispatch(setProgress(progress)),

    /****---  For Player   ----****/
    next: () => dispatch(next()),
    prev: () => dispatch(previous()),
    toggle: (currentSong, currentSongList) => dispatch(toggleSong(currentSong, currentSongList)),
  })
};


export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
