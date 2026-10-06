import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const roomReservations = await prisma.roomReservation.findMany({
    include: { room: true, requester: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(roomReservations, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
