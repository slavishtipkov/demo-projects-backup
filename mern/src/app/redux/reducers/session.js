import * as mutations from "../saga/mutations";

const initState = {};

export default (state = initState, action) => {
  const { type, authenticated } = action;

  switch (type) {
    case mutations.SET_STATE:
      return { ...state, id: action.state.session.id };
    case mutations.REQUEST_AUTHENTICATE_USER:
      return { ...state, authenticated: mutations.AUTHENTICATING };
    case mutations.PROCESSING_AUTHENTICATE_USER:
      return { ...state, authenticated };
    default:
      return state;
  }
};
