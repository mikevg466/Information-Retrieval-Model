import {connect} from 'react-redux';
import Stations from '../components/Stations';

const mapStateToProps = state => ({
	stations: createStations(state.songs)
});

const createStations = function(songArray) {
	let stations = {};
	songArray.map(song => {
		if (!stations.hasOwnProperty(song.genre)) {
			stations[song.genre] = [];
		}
		stations[song.genre].push(song);
	})
	return stations;
}

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
