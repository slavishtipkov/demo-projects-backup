import * as mutations from "../saga/mutations";

export default (tasks = [], action) => {
  switch (action.type) {
    case mutations.SET_STATE:
      return action.state.tasks;
    case mutations.CREATE_TASK:
      return [
        ...tasks,
        {
          id: action.taskId,
          name: "New Task",
          group: action.groupId,
          owner: action.ownerId,
          isComplete: false
        }
      ];
    case mutations.SET_TASK_COMPLETE:
      return tasks.map(task => {
        return task.id === action.taskId
          ? { ...task, isComplete: action.isComplete }
          : task;
      });
    case mutations.SET_TASK_GROUP:
      return tasks.map(task => {
        return task.id === action.taskId
          ? { ...task, group: action.groupId }
          : task;
      });
    case mutations.SET_TASK_NAME:
      return tasks.map(task => {
        return task.id === action.taskId
          ? { ...task, name: action.name }
          : task;
      });
  }
  return tasks;
};
