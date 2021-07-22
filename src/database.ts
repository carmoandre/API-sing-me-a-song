import pg from "pg";

const { Pool } = pg;

const connection = new Pool({
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "song_recommendation",
    // CASO CRIE BANCO DE TESTE SUBSTITUIR POR:
    // database: process.env.NODE_ENV === "test" ? "test_song_recommendation" : "song_recommendation",
});

export default connection;
