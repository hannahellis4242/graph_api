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
  const edgesResult = true; //removeEdgesOnVertex(id);
  return result.acknowledged && result.deletedCount === 1 && edgesResult;
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
): Promise<ObjectId> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(edges);
  const result = await collection.insertOne({ source, target, value });
  client.close();
  return result.insertedId;
};

export const outEdges = async (vertex: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(edges);
  const results = await collection.find({ source: vertex }).toArray();
  client.close();
  return results;
};

export const inEdges = async (vertex: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(edges);
  const results = await collection.find({ target: vertex }).toArray();
  client.close();
  return results;
};

const removeEdge = async (edgeId: ObjectId) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(edges);
  const results = await collection.deleteOne({ _id: edgeId });
  client.close();
  return results.acknowledged && results.deletedCount === 1;
};

const removeEdgesOnVertex = async (vertexId: ObjectId) => {
  console.log("removing edges for", vertexId);
  const x = await inEdges(vertexId);
  const y = await inEdges(vertexId);
  const xs = x.concat(y);
  console.log("xs :", xs);
  const edgeIds = Array.from(new Set(xs.flatMap((x) => x).map(({ id }) => id)));
  console.log("edgeIds :", edgeIds);
  if (edgeIds.length === 0) {
    return true;
  }
  const tasks = edgeIds.map(removeEdge);
  console.log("tasks length :", tasks.length);
  const done = await Promise.all(tasks);
  return done.every((x) => x);
};
