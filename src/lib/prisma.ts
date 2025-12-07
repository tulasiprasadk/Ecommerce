import { PrismaClient } from "../../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const db = new Database("/vercel/path0/sqlite.db");

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3(db),
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      adapter: new PrismaBetterSqlite3(db),
    });
  }
  prisma = (global as any).prisma;
}

export { prisma };
