// db.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pwd',
    port: 5432,
});

export default pool;