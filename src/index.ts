import dotenv from "dotenv";
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import morgan from "morgan";

import completionRouter from "./routes/completion";

const app = express();
const port = process.env.PORT || 4321;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allow all origins for testing
app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Sunmarize!");
});

app.use("/api/completion", completionRouter);

if (process.env.NODE_ENV === "development") {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

export default app;