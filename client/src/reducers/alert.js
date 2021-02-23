import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = []; //it is going to be array of object like but empty initally
/*{
    id: 1,
    msg: "please log in",
    alertType: "sucess",
  },*/

export default function (state = initialState, action) {
  //action two things
  //1.madatory->type 2/payload(data)
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload]; //Addidng a alert so inclide state that is alreadyy there
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); //here payload is id
    default:
      return state;
  }
}
