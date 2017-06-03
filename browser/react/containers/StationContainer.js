import {connect} from 'react-redux';
import Station from '../components/Station';
import {convertSong} from '../utils';
import {toggleSong} from '../action-creators/player';

const mapStateToProps = (state, ownProps) => ({
  songs: state.songs
    .filter((song) => song.genre === ownProps.routeParams.stationGenre)
    .map(convertSong),
  currentSong: state.player.currentSong,
  isPlaying: state.player.isPlaying
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleOne: (song, list) => dispatch(toggleSong(song, list))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Station);
