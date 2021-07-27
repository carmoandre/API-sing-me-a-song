import supertest from "supertest";
import app from "../../src/app";

import connection from "../../src/database";
import {
    recommendationBody,
    createRecommendation,
    createRecommendationWithScore,
    createMultipleRecommendationWithScore,
    deleteRecommendationById,
} from "../factories/recommendationFactory";

afterAll(async () => {
    await connection.end();
});

describe("POST /recommendations", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 201 valid params and no conflict", async () => {
        const body = recommendationBody();

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(201);
    });

    it("should answer 400 for invalid name param", async () => {
        const body = recommendationBody();
        body.name = "";

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(400);
    });

    it("should answer 400 for invalid youtubeLink param", async () => {
        const body = recommendationBody();
        body.youtubeLink = "";

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(400);
    });

    it("should answer 409 for conflict coused by already added recommendation", async () => {
        const body = recommendationBody();
        await createRecommendation();

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(409);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 200 valid params", async () => {
        const id = await createRecommendation();

        const response = await supertest(app).post(
            `/recommendations/${id}/upvote`
        );
        expect(response.status).toEqual(200);
    });
    /*
    it("should answer 400 for invalid params", async () => {
        const invalidId = "id";
        const response = await supertest(app).post(
            `/recommendations/${invalidId}/upvote`
        );
        expect(response.status).toEqual(400);
    });

    it("should answer 404 for id not found", async () => {
        const id = await createRecommendation();
        deleteRecommendationById(id);

        const response = await supertest(app).post(
            `/recommendations/${id}/upvote`
        );
        expect(response.status).toEqual(404);
    });
    */
});
/*
describe("POST /recommendations/:id/downvote", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 200 valid params", async () => {
        const id = await createRecommendation();

        const response = await supertest(app).post(
            `/recommendations/${id}/downvote`
        );
        expect(response.status).toEqual(200);
    });

    it("should answer 400 for invalid params", async () => {
        const invalidId = "id";
        const response = await supertest(app).post(
            `/recommendations/${invalidId}/downvote`
        );
        expect(response.status).toEqual(400);
    });

    it("should answer 404 for id not found", async () => {
        const id = await createRecommendation();
        await deleteRecommendationById(id);

        const response = await supertest(app).post(
            `/recommendations/${id}/downvote`
        );
        expect(response.status).toEqual(404);
    });

    it("should answer 404 for score less than -5 ", async () => {
        const downLimitScore = -5;
        const id = await createRecommendationWithScore(downLimitScore);

        const response = await supertest(app).post(
            `/recommendations/${id}/downvote`
        );
        expect(response.status).toEqual(404);
    });
});

describe("GET /recommendations/random", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 200 for not empty recommendation table", async () => {
        const baseScore = 10;
        const numOfInsertions = 2;
        await createMultipleRecommendationWithScore(baseScore, numOfInsertions);

        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.status).toEqual(200);
    });

    it("should answer 404 for empty recommendation table", async () => {
        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.status).toEqual(404);
    });
});

describe("GET /recommendations/top/:amount", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 200 for valid params not empty recommendation table", async () => {
        const baseScore = -5;
        const numOfInsertions = 15;
        await createMultipleRecommendationWithScore(baseScore, numOfInsertions);

        const amount = 10;
        const response = await supertest(app).get(
            `/recommendations/top/${amount}`
        );
        expect(response.status).toEqual(200);
    });

    it("should answer 400 for invalid params", async () => {
        const invalidAmount = "amount";
        const response = await supertest(app).get(
            `/recommendations/top/${invalidAmount}`
        );
        expect(response.status).toEqual(400);
    });

    it("should answer 404 for empty recommendation table", async () => {
        const amount = 10;
        const response = await supertest(app).get(
            `/recommendations/top/${amount}`
        );
        expect(response.status).toEqual(404);
    });
});
*/
