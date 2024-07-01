// db.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postagres_owner',
    host: 'ep-hidden-poetry-a2i3vdr0-pooler.eu-central-1.aws.neon.tech',
    database: 'postagres',
    password: '9nNrQSmlPI6i',
    port: 5432,
});

export default pool;