import { GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types';

export const getItem = () => {
  // will be returned to our `itemReducer`
  return {
    type: GET_ITEMS,
    // `payload` is not required in this action
  }
}

