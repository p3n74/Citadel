import dotenv from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    // Prefer process.env so Docker build (no .env) can pass DATABASE_URL inline; fallback to env() for local .env
    url: process.env.DATABASE_URL ?? env("DATABASE_URL"),
  },
});
