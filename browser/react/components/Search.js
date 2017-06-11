import React from 'react';
import { Link } from 'react-router';

export default function Search (props) {
  const searchQuery = props.searchQuery;
  const handleSubmit = props.handleSubmit;
  const resultList = props.search.list;
  const searchFunc = props.searchFunc;
  const title = props.title;
  const relevancy = props.search.relevancy;
  const updateRelevancy = props.updateRelevancy;

  const searchChange = e => props.setSearchQuery(e.target.value);

  return (
    <div style={{marginTop: '20px'}}>
      {title ? <h2>Selected Search: {title}{relevancy && <span> With Relevancy</span>}</h2> : null}
      <form onSubmit={(e) => {handleSubmit(e, searchQuery, searchFunc)}}>
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
                    <tr key={page.id} onClick={() => relevancy && updateRelevancy(searchQuery, page)}>
                      <td>
                        <a href={ page.url } target="_blank">
                          <img src={ page.image } className="img-thumbnail" />
                        </a>
                      </td>
                      <td>
                        <a href={ page.url } target="_blank">
                          { page.url }
                        </a>
                      </td>
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
