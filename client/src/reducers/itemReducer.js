import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

const initialState = {
  // shopping items
  items: [],
  // loading flag
  // `true` when data is pulled from server
  // `false` when data is received
  loading: false
};

// `state` argument here is not complete store but only a slice of it (single property) called `item`. Because this reducer is associated with the `item` property in root reducer in file `reducers/index.js`.
export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        loading: false
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [action.payload.item, ...state.items]
      }
    case ITEMS_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }
}