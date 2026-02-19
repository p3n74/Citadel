import { createContext } from "@Citadel/api/context";
import { appRouter } from "@Citadel/api/routers/index";
import { auth } from "@Citadel/auth";
import { env } from "@Citadel/env/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import path from "node:path";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use(express.json());

if (env.PUBLIC_DIR) {
  app.use(express.static(env.PUBLIC_DIR));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(env.PUBLIC_DIR!, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).send("OK");
  });
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
