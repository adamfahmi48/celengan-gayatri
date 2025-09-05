// api/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // penting untuk Render Free
});

export async function dbPing() {
  const { rows } = await pool.query('select 1 as ok');
  return rows[0]?.ok === 1;
}

