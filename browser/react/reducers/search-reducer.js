import {
  SET_PAGES,
  SET_FUNCTION
} from '../constants';

const initialState = {
  selected: {},
  list: [],
  searchFunc: () => {},
};

export default function (state = initialState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case SET_PAGES:
      newState.list = action.pages;
      break;

    case SET_FUNCTION:
      newState.searchFunc = action.selectedFunc;
      break;

    default:
      return state;

  }

  return newState;

}
