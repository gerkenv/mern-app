import uuid from 'uuid';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types';

const initialState = {
  items: [
    { id: uuid(), name: 'Bananas' },
    { id: uuid(), name: 'Lemon' },
    { id: uuid(), name: 'Pineapple' },
    { id: uuid(), name: 'Paprika' }
  ]
};

// `state` argument here is actually a complete store, but since it is the `itemReducer` then we have to make changes only in a slice of the store called `item`. Because this reducer is associated with the `item` slice of the store. It is defined in `reducers/index.js`.
export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ITEMS:
      return {
        ...state
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
    default:
      return state;
  }
}