import React from 'react';
import {Link} from 'react-router';
import Songs from './Songs';

export default function Station (props) {
	return (
		<div>
		<h2>{props.routeParams.stationGenre} Station</h2>
		<Songs songs={props.songs} currentSong={props.currentSong}
				isPlaying={props.isPlaying} toggleOne={props.toggleOne} />
		</div>
		)
}
