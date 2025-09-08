import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

import completionRouter from "./routes/completion";

const app = express();
const port = process.env.PORT || 4321;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/completion", completionRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
