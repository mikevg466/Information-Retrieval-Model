import Artist from '../components/Artist';
import {connect} from 'react-redux';
import {toggleSong} from '../action-creators/player';

const mapStateToProps = (state, ownProps) => {
  return (
    Object.assign({
      selectedArtist: state.artists.selected,
      children: ownProps.children
    },
      state.player,
  ))
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleOne: (song, list) => dispatch(toggleSong(song, list))
});

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
