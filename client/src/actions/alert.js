import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 3000) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg: msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
}; //we want to dispatch more than action type from function.
//double => arrow happens cause of thunk middleware
//Redux Thunk is a middleware that lets you call action creators that return a function instead of an action object

//We call this action from the component and reducer will reduce it from type  and return what is written using states as written
