/* eslint-disable import/no-anonymous-default-export */
import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
} from "../actions/types";
const initialState = {
  profile: null, //for individual profle
  profiles: [], //profile listing page
  repos: [],
  loading: true,
  error: {},
};

//
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE: //for both cases same
      return { ...state, profile: payload, loading: false };
    case PROFILE_ERROR:
      return { ...state, error: payload, loading: false };
    case CLEAR_PROFILE:
      return {
        ...state,
        loading: false,
        profile: null,
        repos: [],
      };
    default:
      return state;
  }
}
