import Playlist from '../components/Playlist';
import {toggleSong} from '../action-creators/player';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
  currentSong: state.player.currentSong,
  currentSongList: state.player.currentSongList,
  isPlaying: state.player.isPlaying,
  progress: state.player.progress,
  selectedPlaylist: state.playlists.selected
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleOne: (song, list) => {
    dispatch(toggleSong(song, list));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
