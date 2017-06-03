import React from 'react';

export default function Lyrics (props) {
  console.log("props.lyrics: ", props.lyrics);
  const text = props.lyrics.text;
  const artistQuery = props.artistQuery;
  const songQuery = props.songQuery;
  const handleSubmit = props.handleSubmit;

  const artistChange = e => props.setArtist(e.target.value);
  const songChange = e => props.setSong(e.target.value);
  // console.log("TEXT: ", text)
  return (
    <div style={{marginTop: '20px'}}>
      <form onSubmit={(e) => {handleSubmit(e, artistQuery, songQuery)}}>
        <div className="form-group row">
          <div className="col-md-6 col-xs-12">
            <label className="col-xs-2 control-label">Artist</label>
            <input
              className="form-control"
              type="text"
              value={artistQuery}
              placeholder="Enter an artist name"
              onChange={artistChange}
            />
          </div>
          <div className="col-md-6 col-xs-12">
            <label className="col-xs-2 control-label">Song</label>
            <input
              className="form-control"
              type="text"
              value={songQuery}
              placeholder="Enter a song name"
              onChange={songChange}
            />
          </div>
        </div>
        <pre>{text || 'Search above!'}</pre>
        <button type="submit" className="btn btn-success">
          Search for Lyrics
        </button>
      </form>
    </div>
  );
}
