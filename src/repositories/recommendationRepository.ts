import connection from "../database";
import { Recommendation } from "../interfaces/interfaces";

async function getByNameOrLink(name: string, youtubeLink: string) {
    const recommendation = await connection.query(
        `SELECT * FROM recommendations WHERE name=$1 OR "youtubeLink"=$2`,
        [name, youtubeLink]
    );
    return recommendation.rows[0];
}

async function addNew(name: string, youtubeLink: string) {
    await connection.query(
        `INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)`,
        [name, youtubeLink]
    );
}

async function getById(id: number): Promise<Recommendation> {
    const recommendation = await connection.query(
        `SELECT * FROM recommendations WHERE id=$1`,
        [id]
    );
    return recommendation.rows[0];
}

async function alterScore(id: number, newValue: number) {
    console.log(newValue);
    await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`, [
        newValue,
        id,
    ]);
}

async function deleteById(id: number) {
    await connection.query(`DELETE FROM recommendations WHERE id=$1`, [id]);
}

async function getRandomByPercentage(
    scoreLimit: number
): Promise<Recommendation[]> {
    const where = scoreLimit <= 7 ? "score > 10" : "score <= 10";
    const recommendation = await connection.query(
        `SELECT * FROM recommendations  
        WHERE ${where}
        ORDER BY random()
        LIMIT 1`
    );
    return recommendation.rows;
}

async function getRandom(): Promise<Recommendation[]> {
    const recommendation = await connection.query(
        `SELECT * FROM recommendations
        ORDER BY random()
        LIMIT 1`
    );
    return recommendation.rows;
}

async function amountTop(amount: number): Promise<Recommendation[]> {
    const recommendation = await connection.query(
        `SELECT * FROM recommendations  
        ORDER BY score DESC
        LIMIT ${amount}`
    );
    return recommendation.rows;
}

export {
    getByNameOrLink,
    addNew,
    getById,
    alterScore,
    deleteById,
    getRandomByPercentage,
    getRandom,
    amountTop,
};
