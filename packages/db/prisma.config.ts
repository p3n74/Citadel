import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

dotenv.config({
  path: "../../apps/server/.env",
});

// Dummy URL only used when Prisma needs a URL at load time (e.g. generate). Not used for connections during generate.
const DUMMY_DATABASE_URL = "postgresql://build:build@localhost:5432/build";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? DUMMY_DATABASE_URL,
  },
});
