import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const vertex = Router();

const dbName = process.env.DB_NAME || "graph";
const collectionName = "vertices";

const addVertex = async <T>(value: T): Promise<ObjectId> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection.insertOne({ value });
  client.close();
  return result.insertedId;
};

const findVertexById = async (id: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection
    .findOne({ _id: id })
    .then((x) => (x ? x : undefined));
  client.close();
  return result;
};

const removeVertexById = async (id: Object) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({ _id: id });
  client.close();
  return result.acknowledged && result.deletedCount === 1;
};

vertex.post("/", async (req, res) => {
  const id = await addVertex(req.body);
  res.json({ vertex: id });
});

vertex.get("/", async (req, res) => {
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

vertex.delete("/", async (req, res) => {
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

export default vertex;
