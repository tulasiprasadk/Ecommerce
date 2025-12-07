import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

let prisma: PrismaClient;

const db = new Database("db.sqlite"); // Local SQLite file
const adapter = new PrismaBetterSqlite3(db);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  // Avoid creating many instances during dev hot reload
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({ adapter });
  }
  // @ts-ignore
  prisma = global.prisma;
}

export { prisma };
