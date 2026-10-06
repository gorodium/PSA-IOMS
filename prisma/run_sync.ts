import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function run() {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), "prisma", "sync_missing_columns.sql"), "utf-8");
    const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
    
    for (const statement of statements) {
      if (statement.startsWith("--")) continue; // simple skip for pure comment blocks if they were split
      console.log(`Executing:\n${statement.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(statement);
    }
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
