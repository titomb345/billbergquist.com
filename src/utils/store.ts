// Import all reducers

import history from "./history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers } from "redux";
import { applyMiddleware, createStore } from "redux";

const createRootReducer = (history) => combineReducers({
	router: connectRouter(history),
})

const middlewares = [routerMiddleware(history), thunk];

export default createStore(
	createRootReducer(history),
	composeWithDevTools(applyMiddleware(...middlewares))
);
