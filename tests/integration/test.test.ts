import supertest from "supertest";
import app from "../../src/app";

import connection from "../../src/database";

afterAll(async () => {
    await connection.end();
});

describe("GET /test", () => {
    it('should answer with text "OK!" and status 200', async () => {
        const response = await supertest(app).get("/test");
        expect(response.text).toBe("OK!");
        expect(response.status).toBe(200);
    });
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

        const isertion = await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
          RETURNING id`,
            [body.name, body.youtubeLink]
        );
        const id = isertion.rows[0].id;

        await connection.query(`IELETE FROM recommendations WHERE=$1)`, [id]);

        const response = await supertest(app).post(
            `/recommendations/${id}/upvote`
        );
        expect(response.status).toEqual(404);
    });
});
