import 'dotenv/config'; // Forma simplificada de carregar variáveis de ambiente
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default {
    query: (text, params) => pool.query(text, params),
};