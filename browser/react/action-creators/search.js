import {SET_PAGES} from '../constants';
import axios from 'axios';

export const setPages = pages => ({
  type: SET_PAGES,
  pages
});

export const search = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  console.log('terms', terms);
  console.log(`/api/pages?terms=${terms}`);
  return dispatch => {
    axios.get(`/api/pages?terms=${terms}`)
      .then(res => {
        console.log(res.data);
        dispatch(setPages(res.data));
      })
  };
};
