import { Router } from "express";
import { ObjectId } from "mongodb";
import { inEdges, outEdges } from "../database/database";

const vertexEdgeRouter = Router();
vertexEdgeRouter.get("/in", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ usage: { url: "/vertex/edges/in?id=<vertex_id>" } });
    return;
  }
  const result = await inEdges(new ObjectId(id as string));
  res.json({ edges: result });
});
vertexEdgeRouter.get("/out", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res
      .status(400)
      .json({ usage: { url: "/vertex/edges/out?id=<vertex_id>" } });
    return;
  }
  const result = await outEdges(new ObjectId(id as string));
  res.json({ edges: result });
});
export default vertexEdgeRouter;
