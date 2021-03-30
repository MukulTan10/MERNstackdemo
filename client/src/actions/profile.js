import axios from "axios";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
} from "../actions/types";
import { setAlert } from "./alert";

//Get Current User ProfileS

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = axios
      .get("/api/profile/me")
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: GET_PROFILE,
          payload: response.data,
        });
      })
      .catch((err) => {
        // if (err.data.errors) {
        //   let errors = err.data.errors;
        //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        // }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      });
  } catch (err) {
    console.log("Profile Error");
  }
};

//Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = axios
      .get("/api/profile/")
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: GET_PROFILES,
          payload: response.data,
        });
      })
      .catch((err) => {
        // if (err.data.errors) {
        //   let errors = err.data.errors;
        //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        // }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      });
  } catch (err) {
    console.log("Get all Profiles Error");
  }
};

//Get  profile by Id(user)
export const getProfileById = (id) => async (dispatch) => {
  try {
    const res = axios
      .get(`/api/profile/user/${id}`)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: GET_PROFILE,
          payload: response.data,
        });
      })
      .catch((err) => {
        // if (err.data.errors) {
        //   let errors = err.data.errors;
        //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        // }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      });
  } catch (err) {
    console.log("Get all Profiles Error");
  }
};

//create or Update Profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = axios
      .post("/api/profile/createOrEdit", formData, config)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: GET_PROFILE,
          payload: response.data,
        });
        dispatch(
          setAlert(edit ? "Profile Updated" : "Profile Created", "success")
        );

        if (!edit) {
          history.push("/dashboard"); //Redirect
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.statusText,
            status: err.status,
          },
        });
      });
  } catch (err) {
    console.log("Profile Error");
  }
};

// Add Exprience
export const addExprience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = axios
      .put("/api/profile/experience", formData, config)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
        dispatch(setAlert("Experience Added", "success"));

        history.push("/dashboard"); //Redirect
      })
      .catch((err) => {
        console.log(err);
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.statusText,
            status: err.status,
          },
        });
      });
  } catch (err) {
    console.log("Add Experience Error");
  }
};

//Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = axios
      .put("/api/profile/education", formData, config)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
        dispatch(setAlert("Education Added", "success"));

        history.push("/dashboard"); //Redirect
      })
      .catch((err) => {
        console.log(err);
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.statusText,
            status: err.status,
          },
        });
      });
  } catch (err) {
    console.log("Add Education Error");
  }
};

//Delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = axios
      .delete(`/api/profile/experience/${id}`)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
        dispatch(setAlert("Experience Removed", "success"));
      })
      .catch((err) => {
        console.log(err);
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.statusText,
            status: err.status,
          },
        });
      });
  } catch (err) {
    console.log("Delete Experience Error");
  }
};

//Delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = axios
      .delete(`/api/profile/education/${id}`)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
        dispatch(setAlert("Education Removed", "success"));
      })
      .catch((err) => {
        console.log(err);
        if (err.data.errors) {
          let errors = err.data.errors;
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.statusText,
            status: err.status,
          },
        });
      });
  } catch (err) {
    console.log("Delete Education Error");
  }
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure ?This cannot be undone! ")) {
    try {
      const res = axios
        .delete(`/api/profile/delete`)
        .then((response) => {
          if (response.data.errors) return Promise.reject(response);

          dispatch({
            type: CLEAR_PROFILE,
          });
          dispatch({
            type: ACCOUNT_DELETED,
          });
          dispatch(setAlert("Your Account has been permanantly deleted"));
        })
        .catch((err) => {
          console.log(err);
          if (err.data.errors) {
            let errors = err.data.errors;
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
          }
          dispatch({
            type: PROFILE_ERROR,
            payload: {
              msg: err.statusText,
              status: err.status,
            },
          });
        });
    } catch (err) {
      console.log("Delete Education Error");
    }
  }
};

//Get  Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = axios
      .get(`/api/profile/github/${username}`)
      .then((response) => {
        if (response.data.errors) return Promise.reject(response);

        dispatch({
          type: GET_REPOS,
          payload: response.data,
        });
      })
      .catch((err) => {
        console.log(err, "git");
        // if (err.data.errors) {
        //   let errors = err.data.errors;
        //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        // }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: "cannot connect",
            status: err.response.status,
          },
        });
      });
  } catch (err) {
    console.log("Get all Profiles Error");
  }
};
