import { PrismaClient, ActivityType } from '@prisma/client';
import { addDays, startOfWeek } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding calendar activities...');

  // Clear existing to avoid duplicates when running multiple times
  await prisma.calendarActivity.deleteMany({});

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday

  const activities = [
    {
      type: ActivityType.EVENT,
      title: "Quarterly Review Meeting",
      description: "Q2 performance and OKR review",
      startDate: addDays(weekStart, 1), // Monday
      location: "Conference Room A"
    },
    {
      type: ActivityType.TRAVEL,
      title: "Field Deployment - Region X",
      description: "Setting up new branch connectivity",
      startDate: addDays(weekStart, 2), // Tuesday
      endDate: addDays(weekStart, 4), // Thursday
      location: "Region X Branch"
    },
    {
      type: ActivityType.VEHICLE,
      title: "Vehicle Servicing",
      description: "Routine maintenance for SVU-1234",
      startDate: addDays(weekStart, 3), // Wednesday
      vehicleName: "SVU-1234"
    },
    {
      type: ActivityType.HOLIDAY,
      title: "Company Retreat",
      description: "Annual company retreat and holiday",
      startDate: addDays(weekStart, 5), // Friday
      location: "Resort"
    },
    {
      type: ActivityType.TRAVEL,
      title: "Client Site Visit",
      description: "Annual client satisfaction survey",
      startDate: addDays(weekStart, 4), // Thursday
    },
    {
      type: ActivityType.EVENT,
      title: "Training Seminar",
      description: "New software orientation",
      startDate: addDays(weekStart, 1), // Monday
    },
    {
      type: ActivityType.EVENT,
      title: "Workshop: Data Security",
      description: "Mandatory compliance workshop",
      startDate: addDays(weekStart, 2), // Tuesday
    },
    {
      type: ActivityType.VEHICLE,
      title: "Executive Transport",
      description: "Airport pickup for guests",
      startDate: addDays(weekStart, 1), // Monday
      vehicleName: "VAN-5678"
    }
  ];

  for (const activity of activities) {
    await prisma.calendarActivity.create({
      data: activity
    });
  }

  console.log('Successfully seeded calendar activities.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
