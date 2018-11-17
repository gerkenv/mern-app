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

// `state` argument here is not a complete store, but only a slice of it
// associated with reducer, that dispatches an action
export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ITEMS:
      return {
        ...state
      };
    default:
      return state;
  }
}