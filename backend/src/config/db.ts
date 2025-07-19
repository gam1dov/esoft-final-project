import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types.js";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
