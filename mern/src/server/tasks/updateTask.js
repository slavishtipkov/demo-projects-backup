import { connectDb } from "../db/connectDb";

export const updateTask = async task => {
  let { id, group, isComplete, name } = task;
  let db = await connectDb();
  let collection = db.collection("tasks");

  if (group) {
    await collection.updateOne({ id }, { $set: { group } });
  }

  if (name) {
    await collection.updateOne({ id }, { $set: { name } });
  }

  if (isComplete !== undefined) {
    await collection.updateOne({ id }, { $set: { isComplete } });
  }
};

export const updateTaskRoute = app => {
  app.post("/task/update", async (req, res) => {
    let task = req.body.task;
    await updateTask(task);
    res.status(200).send();
  });
};
