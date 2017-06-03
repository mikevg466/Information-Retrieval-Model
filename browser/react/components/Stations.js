import React from 'react';
import {Link} from 'react-router';

export default function Stations (props) {
	console.log("stationS props: ", props)
	return (<div>
		      <h3>Stations</h3>
		      <div className="list-group">
		      {
		        props.stations && Object.keys(props.stations).map(station => {
		          return (
		            <div className="list-group-item" key={station}>
		              <Link to={`/stations/${station}` }>{station}</Link>
		            </div>
		          );
		        })
		      }
		      </div>
		    </div>)

}
