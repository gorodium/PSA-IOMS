import { PrismaClient } from "@prisma/client";

// Source: Supabase
const source = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.rcekngtqkiwibdejtkcu:Prisoner201131460@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
    },
  },
});

// Destination: Neon
const dest = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_jy2vMVlpNuZ1@ep-misty-boat-azrjovsx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    },
  },
});

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function copyTable<T>(
  name: string,
  fetcher: () => Promise<T[]>,
  inserter: (batch: any[]) => Promise<any>
) {
  const rows = await fetcher();
  if (rows.length === 0) {
    log(`  ${name}: 0 rows (skipped)`);
    return;
  }
  const BATCH = 100;
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await inserter(batch);
    total += batch.length;
  }
  log(`  ${name}: ${total} rows copied`);
}

async function main() {
  log("=== Starting Supabase → Neon data migration ===");

  // 1. Personnel
  await copyTable(
    "Personnel",
    () => source.personnel.findMany(),
    (data) => dest.personnel.createMany({ data, skipDuplicates: true })
  );

  // 2. Users
  await copyTable(
    "User",
    () => source.user.findMany(),
    (data) => dest.user.createMany({ data, skipDuplicates: true })
  );

  // 3. Link user <-> personnel
  await copyTable(
    "User (personnelId update)",
    async () => {
      const users = await source.user.findMany({ where: { personnelId: { not: null } } });
      return users;
    },
    async (users) => {
      for (const u of users) {
        await dest.user.update({ where: { id: u.id }, data: { personnelId: u.personnelId } }).catch(() => {});
      }
      return { count: users.length };
    }
  );

  // 4. Calendar Activities
  await copyTable(
    "CalendarActivity",
    () => source.calendarActivity.findMany(),
    (data) => dest.calendarActivity.createMany({ data, skipDuplicates: true })
  );

  // 5. Vehicles
  await copyTable(
    "Vehicle",
    () => source.vehicle.findMany(),
    (data) => dest.vehicle.createMany({ data, skipDuplicates: true })
  );

  // 6. Vehicle Requests
  await copyTable(
    "VehicleRequest",
    () => source.vehicleRequest.findMany(),
    (data) => dest.vehicleRequest.createMany({ data, skipDuplicates: true })
  );

  // 6b. Vehicle Request Passengers
  await copyTable(
    "VehicleRequestPassenger",
    () => source.vehicleRequestPassenger.findMany(),
    (data) => dest.vehicleRequestPassenger.createMany({ data, skipDuplicates: true })
  );

  // 7. Rooms
  await copyTable(
    "Room",
    () => source.room.findMany(),
    (data) => dest.room.createMany({ data, skipDuplicates: true })
  );

  // 8. Room Reservations
  await copyTable(
    "RoomReservation",
    () => source.roomReservation.findMany(),
    (data) => dest.roomReservation.createMany({ data, skipDuplicates: true })
  );

  // 9. Projects
  await copyTable(
    "Project",
    () => source.project.findMany(),
    (data) => dest.project.createMany({ data, skipDuplicates: true })
  );

  // 10. Project Personnel
  await copyTable(
    "ProjectPersonnel",
    () => source.projectPersonnel.findMany(),
    (data) => dest.projectPersonnel.createMany({ data, skipDuplicates: true })
  );

  // 11. Project Cycles
  await copyTable(
    "ProjectCycle",
    () => source.projectCycle.findMany(),
    (data) => dest.projectCycle.createMany({ data, skipDuplicates: true })
  );

  // 12. Project Tasks
  await copyTable(
    "ProjectTask",
    () => source.projectTask.findMany(),
    (data) => dest.projectTask.createMany({ data, skipDuplicates: true })
  );

  // 13. Project Remarks
  await copyTable(
    "ProjectRemark",
    () => source.projectRemark.findMany(),
    (data) => dest.projectRemark.createMany({ data, skipDuplicates: true })
  );

  // 14. Convocation Groups
  await copyTable(
    "ConvocationGroup",
    () => source.convocationGroup.findMany(),
    (data) => dest.convocationGroup.createMany({ data, skipDuplicates: true })
  );

  // 15. Convocation Group Members
  await copyTable(
    "ConvocationGroupMember",
    () => source.convocationGroupMember.findMany(),
    (data) => dest.convocationGroupMember.createMany({ data, skipDuplicates: true })
  );

  // 16. Convocation Template Items
  await copyTable(
    "ConvocationTemplateItem",
    () => source.convocationTemplateItem.findMany(),
    (data) => dest.convocationTemplateItem.createMany({ data, skipDuplicates: true })
  );

  // 17. Convocation Programs
  await copyTable(
    "ConvocationProgram",
    () => source.convocationProgram.findMany(),
    (data) => dest.convocationProgram.createMany({ data, skipDuplicates: true })
  );

  // 18. Convocation Program Items
  await copyTable(
    "ConvocationProgramItem",
    () => source.convocationProgramItem.findMany(),
    (data) => dest.convocationProgramItem.createMany({ data, skipDuplicates: true })
  );

  // 19. Convocation Assignment History
  await copyTable(
    "ConvocationAssignmentHistory",
    () => source.convocationAssignmentHistory.findMany(),
    (data) => dest.convocationAssignmentHistory.createMany({ data, skipDuplicates: true })
  );

  // 20. PDF Templates
  await copyTable(
    "PdfTemplate",
    () => source.pdfTemplate.findMany(),
    (data) => dest.pdfTemplate.createMany({ data, skipDuplicates: true })
  );


  // 22. Chat Channels
  await copyTable(
    "ChatChannel",
    () => source.chatChannel.findMany(),
    (data) => dest.chatChannel.createMany({ data, skipDuplicates: true })
  );

  // 23. Chat Channel Members
  await copyTable(
    "ChatChannelMember",
    () => source.chatChannelMember.findMany(),
    (data) => dest.chatChannelMember.createMany({ data, skipDuplicates: true })
  );

  // 24. Chat Messages
  await copyTable(
    "ChatMessage",
    () => source.chatMessage.findMany(),
    (data) => dest.chatMessage.createMany({ data, skipDuplicates: true })
  );

  // 25. Chat Message Reads
  await copyTable(
    "ChatMessageRead",
    () => source.chatMessageRead.findMany(),
    (data) => dest.chatMessageRead.createMany({ data, skipDuplicates: true })
  );

  // 26. Chat Attachments
  await copyTable(
    "ChatAttachment",
    () => source.chatAttachment.findMany(),
    (data) => dest.chatAttachment.createMany({ data, skipDuplicates: true })
  );

  // 27. Audit Logs
  await copyTable(
    "AuditLog",
    () => source.auditLog.findMany(),
    (data) => dest.auditLog.createMany({ data, skipDuplicates: true })
  );

  log("=== Migration complete! ===");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await source.$disconnect();
    await dest.$disconnect();
  });
