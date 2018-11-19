import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';
import axios from 'axios';

// Some actions here are connected through `connect` function in smart components (containers), this way, what they return is dispatched to all reducers.
// Others are dispatching an action types on their own.

export const getItems = () => dispatch => {
  // dispatch (emit) an action (an event)
  dispatch(setItemsLoading());
  // send request to server to get all items
  // we can use links without `host` name because we set `proxy` to `host` in our `package.json`
  axios.get('/api/items').then(res => {
    console.log({res});
    // dispatch (emit) an action (an event)
    dispatch({
      type: GET_ITEMS,
      payload: {
        items: res.data
      }
    })
  });
}

export const deleteItem = (id) => (dispatch) => {
  // send request to delete an item
  axios.delete(`/api/items/${id}`).then(res => {
    console.log({res});
    // dispatch (emit) an action (an event)
    dispatch({
      type: DELETE_ITEM,
      payload: {
        id
      }
    })
  });
}

export const addItem = (item) => (dispatch) => {
  // send request to add an item
  axios.post('/api/items', item).then(res => {
    console.log({res});
    // dispatch (emit) an action (an event)
    dispatch({
      type: ADD_ITEM,
      payload: {
        item: res.data
      }
    })
  });
}

export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING,
    // `payload` is not required in this action
  }
}
