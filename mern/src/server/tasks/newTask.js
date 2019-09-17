import { connectDb } from "../db/connectDb";

export const addNewTask = async task => {
  let db = await connectDb();
  let collection = db.collection("tasks");
  await collection.insertOne(task);
};

export const newTaskRoute = app => {
  app.post("/task/new", async (req, res) => {
    let task = req.body.task;
    await addNewTask(task);
    res.status(200).send();
  });
};
