import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connectDb } from "./db/connectDb";

import { authenticationRoute } from "./authenticate/authenticate";
import { newTaskRoute } from "./tasks/newTask";
import { updateTaskRoute } from "./tasks/updateTask";

import "./db/initializeDb";

const port = 7777;
const app = express();

app.listen(port, console.log("Server listening on port ... ", port));

app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

authenticationRoute(app);

newTaskRoute(app);

updateTaskRoute(app);
