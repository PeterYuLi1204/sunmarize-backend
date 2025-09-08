import express from "express";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { OPENAI_MODEL, GEMINI_MODEL, PROMPT } from "../utils/config";

const completionRouter = express.Router();

const openai = new OpenAI();
const gemini = new GoogleGenAI({});

completionRouter.use((req, res, next) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "Text is required" });
  }
  next();
});

completionRouter.post("/openai", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await openai.responses.create({
    model: OPENAI_MODEL,
    instructions: PROMPT,
    input: req.body.text,
    reasoning: { effort: "minimal" },
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      res.write(event.delta);
    }
  }

  res.end();
});

completionRouter.post("/gemini", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await gemini.models.generateContentStream({
    model: GEMINI_MODEL,
    contents: req.body.text,
    config: {
      systemInstruction: PROMPT,
    },
  });

  for await (const chunk of stream) {
    res.write(chunk.text);
  }

  res.end();
});

export default completionRouter;
