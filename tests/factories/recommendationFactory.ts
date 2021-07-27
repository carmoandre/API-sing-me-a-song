import connection from "../../src/database";
import { AddInput } from "../../src/interfaces/interfaces";

function recommendationBody(): AddInput {
    const body = {
        name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
        youtubeLink:
            "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
    };

    return body;
}

function recommendationBodyWithScore(score: number) {
    const body = {
        name: "GOOD 4 U (LEOD PISADINHA EDIT) - SAMUSIC",
        youtubeLink:
            "https://www.youtube.com/watch?v=qfaDUDwIaPE&ab_channel=SAMusic",
        score: score,
    };

    return body;
}

async function createRecommendation() {
    const body = recommendationBody();

    const result = await connection.query(
        `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)
        RETURNING id`,
        [body.name, body.youtubeLink]
    );

    return result.rows[0].id;
}

async function createRecommendationWithScore(score: number) {
    const body = recommendationBodyWithScore(score);

    const result = await connection.query(
        `INSERT INTO recommendations (name, "youtubeLink", score) VALUES ($1, $2, $3)
        RETURNING id`,
        [body.name, body.youtubeLink, body.score]
    );

    return result.rows[0].id;
}

async function createMultipleRecommendationWithScore(
    baseScore: number,
    numOfInsertions: number
) {
    const body = recommendationBodyWithScore(baseScore);

    for (let i = 0; i < numOfInsertions; i++) {
        await connection.query(
            `INSERT INTO recommendations (name, "youtubeLink", score) 
                VALUES ($1, $2, $3)`,
            [body.name + `${i}`, body.youtubeLink + `${i}`, body.score + i]
        );
    }
}

async function deleteRecommendationById(id: number) {
    await connection.query(`DELETE FROM recommendations WHERE id=$1`, [id]);
}

export {
    recommendationBody,
    recommendationBodyWithScore,
    createRecommendation,
    createRecommendationWithScore,
    createMultipleRecommendationWithScore,
    deleteRecommendationById,
};
