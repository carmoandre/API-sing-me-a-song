import { Request, Response } from "express";

import { addSchema, improveSchema } from "../joiSchemas/schemas";
import * as recommendationService from "../services/recommendationService";

async function addNew(req: Request, res: Response) {
    try {
        const validation = addSchema.validate(req.body);
        if (validation.error) return res.sendStatus(400);

        const { name, youtubeLink } = req.body;
        const success = await recommendationService.addNew(name, youtubeLink);

        const status = success ? 201 : 409;
        res.sendStatus(status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function improveScore(req: Request, res: Response) {
    try {
        const validation = improveSchema.validate(req.params);
        if (validation.error) return res.sendStatus(400);

        const { id } = req.params;
        const success = await recommendationService.improveScore(parseInt(id));

        const status = success ? 200 : 404;
        res.sendStatus(status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function reduceScore() {}

export { addNew, improveScore, reduceScore };
