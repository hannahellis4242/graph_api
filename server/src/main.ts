import express, { json } from "express";
import edgeRouter from "./Routes/edgeRouter";
import vertexRouter from "./Routes/vertexRouter";

const app = express();
app.use(json());

app.use("/vertex", vertexRouter);
app.use("/edge", edgeRouter);

const host = process.env.HOST || "localhost";
const port = Number.parseInt(process.env.PORT || "3001");
app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
