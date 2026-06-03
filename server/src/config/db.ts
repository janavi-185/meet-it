import { Pool } from "pg";
import { env } from "./env.js";

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : false,
});

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection failed;", error);
    throw error;
  }
};

export default pool;
