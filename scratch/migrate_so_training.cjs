const { PrismaClient, ActivityType } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting migration of Calendar Activities...");

  // 1. Fetch all Calendar Activities
  const activities = await prisma.calendarActivity.findMany({
    where: {
      soNumber: { not: null }
    }
  });

  console.log(`Found ${activities.length} Calendar Activities linked to Special Orders.`);

  let updatedCount = 0;

  for (const activity of activities) {
    const isTraining = activity.description?.toLowerCase().includes("taining") || 
                       activity.description?.toLowerCase().includes("training") ||
                       activity.title?.toLowerCase().includes("taining") ||
                       activity.title?.toLowerCase().includes("training");

    // Existing "TRAVEL" meant it was outside office (according to the old logic)
    const isTravel = activity.type === "TRAVEL";

    let needsUpdate = false;
    let newType = activity.type;
    let newAdditionalTypes = activity.additionalTypes || [];

    if (isTraining && activity.type !== "TRAINING") {
      newType = "TRAINING";
      needsUpdate = true;
      if (isTravel && !newAdditionalTypes.includes("TRAVEL")) {
        newAdditionalTypes.push("TRAVEL");
      }
    }

    if (needsUpdate) {
      await prisma.calendarActivity.update({
        where: { id: activity.id },
        data: {
          type: newType,
          additionalTypes: newAdditionalTypes
        }
      });
      updatedCount++;
      console.log(`Updated Activity ${activity.id} (SO: ${activity.soNumber}) -> type: ${newType}, additionalTypes: [${newAdditionalTypes.join(', ')}]`);
    }
  }

  console.log(`Migration complete! Updated ${updatedCount} activities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
