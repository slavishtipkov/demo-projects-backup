import uuid from "uuid";
import md5 from "md5";
import { connectDb } from "../db/connectDb";

const authenticationTokens = [];

async function assembleUserState(user) {
  let db = await connectDb();

  let tasks = await db
    .collection("tasks")
    .find({ owner: user.id })
    .toArray();

  let groups = await db
    .collection("groups")
    .find({ owner: user.id })
    .toArray();

  return {
    tasks,
    groups,
    session: {
      authenticated: "AUTHENTICATED",
      id: user.id
    }
  };
}

export const authenticationRoute = app => {
  app.post("/authenticate", async (req, res) => {
    let { username, password } = req.body;
    let db = await connectDb();
    let collection = db.collection("users");

    let user = await collection.findOne({ name: username });

    if (!user) {
      return res.status(500).send("User not found");
    }

    let hash = md5(password);
    let passwordCorrect = hash === user.passwordHash;

    if (!passwordCorrect) {
      return res.status(500).send("Password incorrect");
    }

    let token = uuid();

    authenticationTokens.push({
      token,
      userId: user.id
    });

    let state = await assembleUserState(user);

    res.send({ token, state });
  });
};
