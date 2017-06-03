import Sidebar from '../components/Sidebar';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
  playlists: state.playlists.list
})

export default connect(mapStateToProps)(Sidebar);
