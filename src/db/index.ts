import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Local SQLite file by default. Point DATABASE_URL at a Turso database
// (libsql://...) plus DATABASE_AUTH_TOKEN to run against a hosted DB.
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export * from "./schema";
