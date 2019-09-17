import React from "react";
import { connect } from "react-redux";

import { ConnectedTaskList } from "./taskList";

export const Dashboard = ({ groups }) => (
  <div>
    <h2>Dashboard</h2>
    {groups.map(group => (
      <ConnectedTaskList key={group.id} id={group.id} name={group.name} />
    ))}
  </div>
);

const mapStateToProps = state => {
  return {
    groups: state.groups
  };
};

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);
