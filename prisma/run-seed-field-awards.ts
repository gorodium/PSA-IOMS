import { PrismaClient } from "@prisma/client";
import { seedFieldAwards } from "./seed-field-awards";

const prisma = new PrismaClient();

seedFieldAwards(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
