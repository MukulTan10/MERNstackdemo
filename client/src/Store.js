//Redux file Boiler plate
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk"; //actuall middleware
import rootReducer from "./reducers"; //if just folder present means from index.js

const initialState = {};

const middleware = [thunk]; //aray of middle are ,but we only have thunk here

const Store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default Store;
