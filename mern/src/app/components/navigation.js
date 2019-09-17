import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Navigation = () => (
  <div>
    <Link to="/dashboard">
      <h2>MERN App</h2>
    </Link>
  </div>
);

export const ConnectedNavigation = connect(state => state)(Navigation);
