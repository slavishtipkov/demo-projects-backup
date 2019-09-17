import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";
import { StyleSheetManager } from "styled-components";
import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  DeepPartial,
  ReducersMapObject,
  Store,
} from "redux";
import { combineEpics, createEpicMiddleware, Epic } from "redux-observable";

declare global {
  interface Window {
    readonly __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

export function renderWidget<S, A extends Action = AnyAction, D = any>(options: {
  readonly rootComponent: React.ReactNode;
  readonly container: Element | string;
  readonly rootReducer: ReducersMapObject<S, A>;
  readonly epics: ReadonlyArray<Epic<A, A, S, D>>;
  readonly epicDependencies: D;
  readonly initialState: DeepPartial<S>;
}): { readonly store: Store<S, A>; readonly component: Provider } {
  let container =
    options.container instanceof Element
      ? options.container
      : document.querySelector(options.container)!;

  if (!container) {
    throw new Error("You must provide a valid Element or selector to initialize a widget");
  }

  let rootEpic = combineEpics(...options.epics);
  let rootReducer = combineReducers(options.rootReducer);
  let epicMiddleware = createEpicMiddleware<A, A, S, D>({
    dependencies: options.epicDependencies,
  });
  let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore<S, A, any, any>(
    rootReducer,
    options.initialState,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );

  epicMiddleware.run(rootEpic);

  let providerWithApp = React.createElement(
    Provider,
    { store },
    <StyleSheetManager target={container}>{options.rootComponent}</StyleSheetManager>,
  );
  let component = ReactDom.render(providerWithApp, container);

  return {
    store,
    component,
  };
}
