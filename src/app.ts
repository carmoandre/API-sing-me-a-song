import express from "express";
import cors from "cors";

import * as recommendationController from "./controllers/recommendationController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("OK!");
});

app.post("/recommendations", recommendationController.addNew);

app.post("/recommendations/:id/upvote", recommendationController.improveScore);

app.post("/recommendations/:id/downvote", recommendationController.reduceScore);

app.get("/recommendations/random");

app.get("/recommendations/top/:amount");

export default app;
