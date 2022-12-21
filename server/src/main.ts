import express, { json } from "express";
import edge from "./Routes/edge";
import vertex from "./Routes/vertex";

const app = express();
app.use(json());

app.use("/vertex", vertex);
app.use("/edge", edge);

const host = process.env.HOST || "localhost";
const port = Number.parseInt(process.env.PORT || "3001");
app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
