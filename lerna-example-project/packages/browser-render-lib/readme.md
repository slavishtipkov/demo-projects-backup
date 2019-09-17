# @dtn/browser-render-lib

A package for rendering DTN widgets in the browser. This package acts as a wrapper around [React DOM](https://reactjs.org/docs/react-dom.html) to standardize it's usage along with simplifying the overall process of configuring Redux stores, Redux Observable epics, etc.

## Install

```sh
npm install --dev @dtn/browser-render-lib
```

## Key Concepts

1.  [React DOM](https://reactjs.org/docs/react-dom.html)
1.  [createStore](https://github.com/reduxjs/redux/blob/master/docs/api/createStore.md)
1.  [Redux Observable's Middleware](https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html)

## API

The package exports a single renderWidget function

### `renderWidget`

```TypeScript
interface RenderWidget<S, A extends Action = AnyAction, D = any> {
  (options: {
    readonly rootComponent: React.ReactNode;
    readonly rootElement: Element;
    readonly rootReducer: Redux.ReducersMapObject<S, A>;
    readonly epics: ReadonlyArray<ReduxObservable.Epic<A, A, S, D>>;
    readonly epicDependencies: D;
    readonly initialState: DeepPartial<S>;
  }): { readonly store: Redux.Store<S, A>; readonly component: Redux.Provider }
}
```

#### The `options`

- `rootComponent` - Entry point for React.
- `rootElement` - DOM element to mount the React component to.
- `rootReducer` - The result of calling Redux's `combineReducer` function.
- `epics` - An array of all Redux Observable epics to be used.
- `epicDependencies` - An object passed along to all epics. [See here](https://redux-observable.js.org/docs/recipes/InjectingDependenciesIntoEpics.html)
- `initialState` - Initial data to populate the Redux store with.

#### `ReturnType<renderWidget>`

`renderWidget` returns an object with two properties.

- `store` - An instance of a redux store
- `provider` - A redux Store `Provider` component wraps the `rootComponent`

### `WidgetFactory`

This is the type all widget factory functions must implement.

```TypeScript
export type WidgetFactory<P extends {}, T = {}, R = {}> = (
  config: AppConfig & WidgetConfig & P & { readonly theme: T; readonly [key: string]: any },
) => R;
```

It's purpose is to ensure all widget factory function conform to a standard set of configuration while allowing for flexibility to implement their own options.
