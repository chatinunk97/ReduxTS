import { createStore, applyMiddleware } from "redux";
// This createStore is deprecated because they are encouraging
// dev to use Redux Tool Kit which is more handy
import { thunk } from "redux-thunk";
import reducers from "./reducers";

export const store = createStore(reducers, {}, applyMiddleware(thunk));
// createStore( <reducer> , <initialState> , applyMiddleware(<middleWare>))
