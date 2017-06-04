import React from 'react';

export default function Search (props) {
  const searchQuery = props.searchQuery;
  const handleSubmit = props.handleSubmit;
  const resultList = props.search.list;

  const searchChange = e => props.setSearchQuery(e.target.value);

  return (
    <div style={{marginTop: '20px'}}>
      <form onSubmit={(e) => {handleSubmit(e, searchQuery)}}>
        <div className="form-group row">
          <div className="col-md-12 col-xs-12">
            <label className="col-xs-2 control-label">Search</label>
            <input
              className="form-control"
              type="text"
              value={searchQuery}
              placeholder="Enter search query"
              onChange={searchChange}
            />
          </div>
        </div>
        {
          !resultList.length ?
            <pre>{'Search above!'}</pre> :
            <table className='table'>
              <tbody>
                {
                  resultList.map(page => (
                    <tr key={page.id}>
                      <td>{ page.image }</td>
                      <td>{ page.url }</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
        }
        <button type="submit" className="btn btn-success">
          Search!
        </button>
      </form>
    </div>
  );
}
