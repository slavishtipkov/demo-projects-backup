import { combineReducers } from "redux";

import comments from "./comments";
import groups from "./groups";
import session from "./session";
import tasks from "./tasks";
import users from "./users";

export default combineReducers({ comments, groups, session, tasks, users });
