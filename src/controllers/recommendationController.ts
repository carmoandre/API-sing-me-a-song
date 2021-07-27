import { Request, Response } from "express";

import { addSchema, amountSchema, improveSchema } from "../joiSchemas/schemas";
import * as recommendationService from "../services/recommendationService";
import { AddInput } from "../interfaces/interfaces";

async function addNew(req: Request, res: Response) {
    try {
        const validation = addSchema.validate(req.body);
        if (validation.error) return res.sendStatus(400);

        const { name, youtubeLink }: AddInput = req.body;
        const success = await recommendationService.addNew(name, youtubeLink);

        const status = success ? 201 : 409;
        res.sendStatus(status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function alterScore(req: Request, res: Response) {
    try {
        const validation = improveSchema.validate(req.params);
        if (validation.error) return res.sendStatus(400);

        const { id } = req.params;
        const upOrDown: string = req.path.replace(
            `/recommendations/${id}/`,
            ""
        );
        const success = await recommendationService.alterScore(
            parseInt(id),
            upOrDown
        );

        const status = success ? 200 : 404;
        res.sendStatus(status);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function random(req: Request, res: Response) {
    try {
        const result = await recommendationService.random();
        if (result.length) {
            res.status(200).send(result);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function amountTop(req: Request, res: Response) {
    try {
        const validation = amountSchema.validate(req.params);
        if (validation.error) return res.sendStatus(400);
        const { amount } = req.params;
        const result = await recommendationService.amountTop(parseInt(amount));
        if (result.length) {
            res.status(200).send(result);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export { addNew, alterScore, random, amountTop };
