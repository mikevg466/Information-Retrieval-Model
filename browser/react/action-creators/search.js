import {SET_PAGES, SET_FUNCTION} from '../constants';
import axios from 'axios';

export const setPages = pages => ({
  type: SET_PAGES,
  pages
});
export const setFunction = selectedFunc => ({
  type: SET_FUNCTION,
  selectedFunc
})

export const booleanSearch = (terms) => {
  terms = terms.replace(/\s+/, '%20');
  return dispatch => {
    axios.get(`/api/pages?terms=${terms}`)
      .then(res => {
        dispatch(setPages(res.data));
      })
  };
};
