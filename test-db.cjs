const { PrismaClient } = require('@prisma/client');
const { subMonths, addMonths } = require('date-fns');

const db = new PrismaClient();

async function test() {
  const start = subMonths(new Date(), 1);
  const end = addMonths(new Date(), 1);
  try {
    const specialOrders = await db.specialOrder.findMany({
      where: {
        activityDate: { gte: start, lte: end },
      },
      include: { people: { include: { personnel: true } } },
    });
    console.log('Success:', specialOrders.length);
  } catch (e) {
    console.error('Error in specialOrders:', e.message);
  }
}

test().finally(() => db.$disconnect());
