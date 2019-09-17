import * as mutations from "../saga/mutations";

export default (groups = [], action) => {
  switch (action.type) {
    case mutations.SET_STATE:
      return action.state.groups;
    default:
      return groups;
  }
};
