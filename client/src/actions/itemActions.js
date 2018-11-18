import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';
import axios from 'axios';

// Some actions here are connected through `connect` function in smart components (containers), this way, what they return is dispatched to all reducers.
// Others are dispatching an action types on their own.

export const getItems = () => dispatch => {
  // dispatch (emit) an action (an event)
  dispatch(setItemsLoading());
  // send request to server to get all items
  // we can use links without `host` name because we set `proxy` to `host` in our `package.json`
  axios.get('/api/items')
    .then(res => {
      console.log({res});
      // dispatch (emit) an action (an event)
      dispatch({
        type: GET_ITEMS,
        payload: {
          items: res.data
        }
      })
    })
}

export const deleteItem = (id) => {
  return {
    type: DELETE_ITEM,
    payload: {
      id
    }
  };
}

export const addItem = (item) => {
  return {
    type: ADD_ITEM,
    payload: {
      item
    }
  };
}

export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING,
    // `payload` is not required in this action
  }
}
