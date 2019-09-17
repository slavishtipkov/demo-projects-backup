import React from "react";
import { Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import { Provider } from "react-redux";

import { store } from "../redux/store";
import { history } from "../redux/history";

import { ConnectedDashboard } from "./dashboard";
import { ConnectedNavigation } from "./navigation";
import { ConnectedTaskDetail } from "./taskDetails";
import { ConnectedLogin } from "./login";

const RouteGuard = Component => ({ match }) => {
  console.info("Route guard", match);

  if (!store.getState().session.authenticated) {
    return <Redirect to="/" />;
  } else {
    return <Component match={match} />;
  }
};

export const App = () => (
  <Router history={history}>
    <Provider store={store}>
      <ConnectedNavigation />
      <Route exact path="/" component={ConnectedLogin} />

      <Route exact path="/dashboard" render={RouteGuard(ConnectedDashboard)} />
      <Route exact path="/task/:id" render={RouteGuard(ConnectedTaskDetail)} />
    </Provider>
  </Router>
);
