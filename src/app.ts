import express from "express";
import cors from "cors";

import * as recommendationController from "./controllers/recommendationController";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", recommendationController.addNew);

app.post("/recommendations/:id/upvote", recommendationController.alterScore);

app.post("/recommendations/:id/downvote", recommendationController.alterScore);

app.get("/recommendations/random", recommendationController.random);

app.get("/recommendations/top/:amount", recommendationController.amountTop);

export default app;
