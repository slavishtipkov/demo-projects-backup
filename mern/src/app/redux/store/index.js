import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import {
  taskCreationSaga,
  taskModificationSaga,
  userAuthenticationSaga
} from "../saga/sagas";

import rootReducer from "../reducers";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(createLogger(), sagaMiddleware)
);

sagaMiddleware.run(taskCreationSaga);
sagaMiddleware.run(taskModificationSaga);
sagaMiddleware.run(userAuthenticationSaga);
