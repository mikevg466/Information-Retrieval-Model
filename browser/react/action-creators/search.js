import { SET_PAGES, SET_RELEVANCY } from '../constants';
import axios from 'axios';

export const setPages = pages => ({
  type: SET_PAGES,
  pages
});

export const setRelevancy = relevancy => ({
  type: SET_RELEVANCY,
  relevancy
});

export const vectorSearch = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.get(`/api/pages/vectorSearch?terms=${terms}`)
      .then(res => {
        dispatch(setPages(res.data));
      })
      .catch(console.error.bind(console));
  };
};

export const booleanSearch = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.get(`/api/pages?terms=${terms}`)
      .then(res => {
        dispatch(setPages(res.data));
      })
      .catch(console.error.bind(console));
  };
};

export const updateRelevancy = (terms, page) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.put(`/api/pages/relevancy?terms=${terms}`, page)
      .then(res => {
        dispatch(vectorSearch(terms));
      })
      .catch(console.error.bind(console))
  }
}
