import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import questionReducer from "./question";
import commentReducer from "./comment";
import queryReducer from "./query";
import savedQuestionReducer from "./savedQuestion";
import tagReducer from "./tag";

const rootReducer = combineReducers({
  session: sessionReducer,
  questions: questionReducer,
  comments: commentReducer,
  query: queryReducer,
  savedQuestions: savedQuestionReducer,
  tags: tagReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
