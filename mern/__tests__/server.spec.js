import { addNewTask } from "../src/server/server";

(async function myFunc() {
  await addNewTask({
    name: "My test task",
    id: "213212213"
  });

  await addNewTask({
    id: "213212213",
    name: "My UPDATED task"
  });
})();
