import {SET_PAGES} from '../constants';
import axios from 'axios';

export const setPages = pages => ({
  type: SET_PAGES,
  pages
});

export const vectorSearch = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.get(`/api/pages/vectorSearch?terms=${terms}`)
      .then(res => {
        dispatch(setPages(res.data));
      });
  };
};

export const booleanSearch = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.get(`/api/pages?terms=${terms}`)
      .then(res => {
        dispatch(setPages(res.data));
      });
  };
};
