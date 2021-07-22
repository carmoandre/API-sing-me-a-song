import connection from "../database";

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

async function getById(id: number) {
    const recommendation = await connection.query(
        `SELECT * FROM recommendations WHERE id=$1`,
        [id]
    );
    return recommendation.rows[0];
}

async function improveScore(id: number, newValue: number) {
    await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`, [
        newValue,
        id,
    ]);
}

export { getByNameOrLink, addNew, getById, improveScore };
