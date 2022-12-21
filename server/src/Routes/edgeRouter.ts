import { Router } from "express";
import { ObjectId } from "mongodb";
import { addEdge } from "../database/database";

const edgeRouter = Router();

edgeRouter.post("/", async (req, res) => {
  const { source, target, value } = req.body;
  if (!(source && target)) {
    res.status(400).json({
      usage: {
        url: "/edge",
        body: "{source:<vertex_id>,target:<vertex_id>,value:<data|undefined>}",
      },
    });
  }
  const id = await addEdge(new ObjectId(source), new ObjectId(target), value);
  res.json({ edge: id });
});

export default edgeRouter;
