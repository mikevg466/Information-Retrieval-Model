import {
  SET_PAGES
} from '../constants';

const initialState = {
  selected: {},
  list: [],
};

export default function (state = initialState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case SET_PAGES:
      newState.list = action.pages;
      break;

    default:
      return state;

  }

  return newState;

}
