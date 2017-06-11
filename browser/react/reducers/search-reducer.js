import {
  SET_PAGES,
  SET_RELEVANCY
} from '../constants';

const initialState = {
  selected: {},
  list: [],
  relevancy: false,
};

export default function (state = initialState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case SET_PAGES:
      newState.list = action.pages;
      break;

    case SET_RELEVANCY:
      newState.relevancy = action.relevancy;
      break;

    default:
      return state;

  }

  return newState;

}
