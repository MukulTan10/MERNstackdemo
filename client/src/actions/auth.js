import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
} from "../actions/types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async (dispatch) => {
  //check to see if there is token ,put global and always send that

  //check local storage
  if (localStorage.token) {
    setAuthToken(localStorage.token); //will only check first time user loads
  }

  try {
    const res = axios
      .get("/api/auth/")
      .then((response) => {
        if (response.data.errors || response.status >= 400)
          return Promise.reject(response);
        dispatch({ type: USER_LOADED, payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: AUTH_ERROR });
      });
  } catch (err) {}
};

//Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = { name, email, password };

  try {
    const res = await axios.post("/api/users/register", body, config);
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = { email, password };

  try {
    const res = axios
      .post("/api/auth/login", body, config)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: LOGIN_SUCCESS,
          payload: response.data,
        });

        dispatch(loadUser());
      })
      .catch((err) => {
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: LOGIN_FAIL,
        });
      });
    // dispatch({
    //   type: LOGIN_SUCCESS,
    //   payload: res.data,
    // });
    // console.log(res);
    // dispatch(loadUser());
  } catch (err) {
    // dispatch({
    //   type: LOGIN_FAIL,
    // });
  }
};

//LOGOUT
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
