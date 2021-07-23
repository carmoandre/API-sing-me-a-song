import supertest from "supertest";
import app from "../../src/app";

import connection from "../../src/database";

afterAll(async () => {
    await connection.end();
});

describe("POST /recommendations", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 201 valid params and no conflict", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(201);
    });

    it("should answer 400 for invalid name param", async () => {
        const body = {
            name: "",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(400);
    });

    it("should answer 400 for invalid youtubeLink param", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink: "",
        };

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);
        expect(response.status).toEqual(400);
    });

    it("should answer 409 for conflict coused by already added recommendation", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)`,
            [body.name, body.youtubeLink]
        );

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
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const result = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
            RETURNING id`,
            [body.name, body.youtubeLink]
        );
        const id = result.rows[0].id;

        const response = await supertest(app).post(
            `/recommendations/${id}/upvote`
        );
        expect(response.status).toEqual(200);
    });

    it("should answer 400 for invalid params", async () => {
        const invalidId = "id";
        const response = await supertest(app).post(
            `/recommendations/${invalidId}/upvote`
        );
        expect(response.status).toEqual(400);
    });

    it("should answer 404 for id not found", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const insertion = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
            RETURNING id`,
            [body.name, body.youtubeLink]
        );
        const id = insertion.rows[0].id;

        await connection.query(`DELETE FROM recommendations WHERE id=$1`, [id]);

        const response = await supertest(app).post(
            `/recommendations/${id}/upvote`
        );
        expect(response.status).toEqual(404);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    beforeEach(async () => {
        await connection.query("DELETE FROM recommendations");
    });

    it("should answer 200 valid params", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const result = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
        RETURNING id`,
            [body.name, body.youtubeLink]
        );
        const id = result.rows[0].id;

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
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const insertion = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
            RETURNING id`,
            [body.name, body.youtubeLink]
        );
        const id = insertion.rows[0].id;

        await connection.query(`DELETE FROM recommendations WHERE id=$1`, [id]);

        const response = await supertest(app).post(
            `/recommendations/${id}/downvote`
        );
        expect(response.status).toEqual(404);
    });

    it("should answer 404 for score less than -5 ", async () => {
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        };

        const downLimitScore = -5;

        const insertion = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink", score) VALUES ($1, $2, $3)
            RETURNING id`,
            [body.name, body.youtubeLink, downLimitScore]
        );
        const id = insertion.rows[0].id;

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
        const bodyOne = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
            score: 4,
        };
        console.log("foi");

        await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink", score) 
            VALUES ($1, $2, $3),
            ($4, $5, $6)
            `,
            [
                bodyOne.name,
                bodyOne.youtubeLink,
                bodyOne.score,
                bodyOne.name + "2",
                bodyOne.youtubeLink + "2",
                bodyOne.score + 1,
            ]
        );
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
        const body = {
            name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
            youtubeLink:
                "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
            score: -5,
        };

        for (let i = 0; i < 15; i++) {
            await connection.query(
                `INSERT INTO recommendations (name, "youtubeLink", score) 
                VALUES ($1, $2, $3)`,
                [body.name + `${i}`, body.youtubeLink + `${i}`, body.score + i]
            );
        }

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
