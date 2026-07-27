const { PrismaClient } = require('@prisma/client');
const { subMonths, addMonths } = require('date-fns');

const db = new PrismaClient();

async function test() {
  const start = subMonths(new Date(), 1);
  const end = addMonths(new Date(), 1);
  try {
    const roomReservations = await db.roomReservation.findMany({
      where: {
        startDate: { gte: start },
        endDate: { lte: end },
      },
      include: { room: true, requester: true },
    });
    console.log('RoomReservations Success:', roomReservations.length);
  } catch (e) {
    console.error('Error in roomReservations:', e.message);
  }
  
  try {
    const vehicleRequests = await db.vehicleRequest.findMany({
      where: {
        departureAt: { gte: start },
        expectedReturnAt: { lte: end },
      },
      include: { assignedVehicle: true, requester: true },
    });
    console.log('VehicleRequests Success:', vehicleRequests.length);
  } catch (e) {
    console.error('Error in vehicleRequests:', e.message);
  }
}

test().finally(() => db.$disconnect());
