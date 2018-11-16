import uuid from 'uuid';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types';

const initialState = {
  items: [
    items: [
      { id: uuid(), name: 'Bananas' },
      { id: uuid(), name: 'Lemon' },
      { id: uuid(), name: 'Pineapple' },
      { id: uuid(), name: 'Paprika' }
    ]
  ]
};

export default functionn(state = initialState, action) {
  switch(action.type) {
    case GET_ITEMS:
      return {
        ...state
      };
    default:
      return state;
  }
}