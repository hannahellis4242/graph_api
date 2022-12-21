import { MongoClient, ObjectId } from "mongodb";

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = process.env.DB_NAME || "graph";
const vertices = "vertices";
const edges = "edges";

export const addVertex = async <T>(value: T): Promise<ObjectId> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(vertices);
  const result = await collection.insertOne({ value });
  client.close();
  return result.insertedId;
};

export const findVertexById = async (id: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(vertices);
  const result = await collection
    .findOne({ _id: id })
    .then((x) => (x ? x : undefined));
  client.close();
  return result;
};

export const removeVertexById = async (id: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(vertices);
  const result = await collection.deleteOne({ _id: id });
  client.close();
  return result.acknowledged && result.deletedCount === 1;
};

export const updateVertexById = async <T>(id: ObjectId, data: T) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(vertices);
  const result = await collection.updateOne(
    { _id: id },
    { $set: { value: data } }
  );
  client.close();
  return result.acknowledged && result.modifiedCount === 1;
};

export const addEdge = async <T>(
  source: ObjectId,
  target: ObjectId,
  value: T
) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(edges);
  const result = await collection.insertOne({ source, target, value });
  client.close();
  return result.insertedId;
};
