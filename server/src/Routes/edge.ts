import { Router } from "express";
import { addEdge } from "../database/database";

const edge = Router();

edge.post("/", (req, res) => {
  const { source, target, value } = req.body;
  if (!(source && target)) {
    res.status(400).json({
      usage: {
        url: "/edge",
        body: "{source:<vertex_id>,target:<vertex_id>,value:<data|undefined>}",
      },
    });
  }
  const edge = addEdge(source, target, value);
  res.json({ edge });
});

export default edge;
