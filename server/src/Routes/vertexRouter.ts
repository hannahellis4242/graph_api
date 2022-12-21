import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {
  addVertex,
  findVertexById,
  removeVertexById,
  updateVertexById,
} from "../database/database";

const vertexRouter = Router();

vertexRouter.post("/", async (req, res) => {
  const id = await addVertex(req.body);
  res.json({ vertex: id });
});

vertexRouter.get("/", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ usage: { url: "/vertex?id=<vertex>" } });
    return;
  }
  const result = await findVertexById(new ObjectId(id as string));
  if (!result) {
    res.sendStatus(404);
  }
  res.json(result);
});

vertexRouter.patch("/", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ usage: { url: "/vertex?id=<vertex>" } });
    return;
  }
  const result = await updateVertexById(new ObjectId(id as string), req.body);
  if (!result) {
    res.sendStatus(404);
  }
  res.json(result);
});

vertexRouter.delete("/", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ usage: { url: "/vertex?id=<vertex>" } });
    return;
  }
  const result = await removeVertexById(new ObjectId(id as string));
  if (!result) {
    res.sendStatus(404);
  }
  res.sendStatus(200);
});

export default vertexRouter;
