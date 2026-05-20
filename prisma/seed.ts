import { PrismaClient, ProjectCategory, ProjectFrequency, ProjectPriority, type TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateProjectCycleStatus, calculateProjectProgress } from "../lib/status";

const prisma = new PrismaClient();

function addDays(days: number) {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

type TaskSeed = {
  taskName: string;
  deadline: Date | null;
  dateSubmitted: Date | null;
  progress: number;
  status: TaskStatus;
  remarks: string | null;
};

const taskScenarios: TaskSeed[][] = [
  [
    {
      taskName: "Prepare monitoring workplan",
      deadline: addDays(-12),
      dateSubmitted: addDays(-11),
      progress: 100,
      status: "COMPLETED",
      remarks: "Completed and filed."
    },
    {
      taskName: "Submit cycle report",
      deadline: addDays(-5),
      dateSubmitted: addDays(-4),
      progress: 100,
      status: "COMPLETED",
      remarks: "Submitted to supervisor."
    }
  ],
  [
    {
      taskName: "Collect field updates",
      deadline: addDays(-3),
      dateSubmitted: null,
      progress: 60,
      status: "OVERDUE",
      remarks: "Pending final section update."
    },
    {
      taskName: "Validate monitoring file",
      deadline: addDays(15),
      dateSubmitted: null,
      progress: 35,
      status: "ON_TRACK",
      remarks: "Validation in progress."
    }
  ],
  [
    {
      taskName: "Coordinate regional submissions",
      deadline: addDays(4),
      dateSubmitted: null,
      progress: 55,
      status: "DUE_SOON",
      remarks: "Follow-up sent to focal persons."
    },
    {
      taskName: "Encode received updates",
      deadline: addDays(18),
      dateSubmitted: null,
      progress: 25,
      status: "ON_TRACK",
      remarks: "Encoding started."
    }
  ],
  [
    {
      taskName: "Review submitted documents",
      deadline: addDays(0),
      dateSubmitted: null,
      progress: 70,
      status: "DUE_TODAY",
      remarks: "For same-day review."
    },
    {
      taskName: "Resolve unmatched records",
      deadline: null,
      dateSubmitted: null,
      progress: 15,
      status: "NO_DEADLINE",
      remarks: "No deadline set yet."
    }
  ],
  [
    {
      taskName: "Prepare collection materials",
      deadline: addDays(12),
      dateSubmitted: null,
      progress: 40,
      status: "ON_TRACK",
      remarks: "Materials under preparation."
    },
    {
      taskName: "Conduct preliminary review",
      deadline: addDays(21),
      dateSubmitted: null,
      progress: 20,
      status: "ON_TRACK",
      remarks: "On schedule."
    }
  ],
  [
    {
      taskName: "Document pending clarifications",
      deadline: null,
      dateSubmitted: null,
      progress: 10,
      status: "NO_DEADLINE",
      remarks: "Awaiting official guidance."
    },
    {
      taskName: "Draft process notes",
      deadline: null,
      dateSubmitted: null,
      progress: 30,
      status: "NO_DEADLINE",
      remarks: "For internal review."
    }
  ],
  [
    {
      taskName: "Complete first-pass validation",
      deadline: addDays(-8),
      dateSubmitted: addDays(-7),
      progress: 100,
      status: "COMPLETED",
      remarks: "Validation completed."
    },
    {
      taskName: "Prepare supervisor briefing",
      deadline: addDays(6),
      dateSubmitted: null,
      progress: 50,
      status: "DUE_SOON",
      remarks: "Briefing deck in progress."
    }
  ],
  [
    {
      taskName: "Reconcile late submissions",
      deadline: addDays(-1),
      dateSubmitted: null,
      progress: 80,
      status: "OVERDUE",
      remarks: "Late submissions still being reconciled."
    },
    {
      taskName: "Prepare exception list",
      deadline: null,
      dateSubmitted: null,
      progress: 45,
      status: "NO_DEADLINE",
      remarks: "Exceptions are being checked."
    }
  ],
  [
    {
      taskName: "Compile supporting files",
      deadline: addDays(-10),
      dateSubmitted: addDays(-9),
      progress: 100,
      status: "COMPLETED",
      remarks: "Files compiled."
    },
    {
      taskName: "Finalize management summary",
      deadline: addDays(-2),
      dateSubmitted: addDays(-1),
      progress: 100,
      status: "COMPLETED",
      remarks: "Summary finalized."
    }
  ],
  [
    {
      taskName: "Update operations tracker",
      deadline: addDays(0),
      dateSubmitted: null,
      progress: 65,
      status: "DUE_TODAY",
      remarks: "Tracker update due today."
    },
    {
      taskName: "Prepare next cycle checklist",
      deadline: addDays(16),
      dateSubmitted: null,
      progress: 25,
      status: "ON_TRACK",
      remarks: "Checklist being drafted."
    }
  ]
];

const personnelData = [
  {
    employeeNo: "GOV-001",
    fullName: "Maria Santos",
    position: "Chief Statistical Specialist",
    section: "Statistical Operations",
    email: "maria.santos@ioms.local",
    contactNo: "0917-100-0001"
  },
  {
    employeeNo: "GOV-002",
    fullName: "Jose Reyes",
    position: "Supervising Statistical Specialist",
    section: "Statistical Operations",
    email: "jose.reyes@ioms.local",
    contactNo: "0917-100-0002"
  },
  {
    employeeNo: "GOV-003",
    fullName: "Ana Cruz",
    position: "Senior Statistical Specialist",
    section: "Statistical Operations",
    email: "ana.cruz@ioms.local",
    contactNo: "0917-100-0003"
  },
  {
    employeeNo: "GOV-004",
    fullName: "Ramon Dela Pena",
    position: "Statistical Specialist II",
    section: "Statistical Operations",
    email: "ramon.delapena@ioms.local",
    contactNo: "0917-100-0004"
  },
  {
    employeeNo: "GOV-005",
    fullName: "Liza Navarro",
    position: "Statistical Analyst",
    section: "Statistical Operations",
    email: "liza.navarro@ioms.local",
    contactNo: "0917-100-0005"
  },
  {
    employeeNo: "GOV-006",
    fullName: "Carlo Mendoza",
    position: "Information Systems Analyst",
    section: "Philippine Identification System",
    email: "carlo.mendoza@ioms.local",
    contactNo: "0917-100-0006"
  },
  {
    employeeNo: "GOV-007",
    fullName: "Grace Tan",
    position: "Administrative Officer IV",
    section: "Administrative and Accounting Reports",
    email: "grace.tan@ioms.local",
    contactNo: "0917-100-0007"
  },
  {
    employeeNo: "GOV-008",
    fullName: "Michael Garcia",
    position: "Accountant III",
    section: "Administrative and Accounting Reports",
    email: "michael.garcia@ioms.local",
    contactNo: "0917-100-0008"
  },
  {
    employeeNo: "GOV-009",
    fullName: "Patricia Lim",
    position: "Statistical Researcher",
    section: "Statistical Operations",
    email: "patricia.lim@ioms.local",
    contactNo: "0917-100-0009"
  },
  {
    employeeNo: "GOV-010",
    fullName: "Ernesto Aquino",
    position: "Statistical Specialist I",
    section: "Statistical Operations",
    email: "ernesto.aquino@ioms.local",
    contactNo: "0917-100-0010"
  }
];

const projectData = [
  {
    name: "Labor Force Survey",
    code: "LFS",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Household Surveys",
    section: "Labor Statistics",
    frequency: ProjectFrequency.QUARTERLY,
    priority: ProjectPriority.HIGH
  },
  {
    name: "Consumer Price Index",
    code: "CPI",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Statistical Framework and Indicators System",
    section: "Price Statistics",
    frequency: ProjectFrequency.MONTHLY,
    priority: ProjectPriority.HIGH
  },
  {
    name: "Family Income and Expenditure Survey",
    code: "FIES",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Household Surveys",
    section: "Income and Expenditure",
    frequency: ProjectFrequency.ANNUAL,
    priority: ProjectPriority.CRITICAL
  },
  {
    name: "Annual Survey of Philippine Business and Industry",
    code: "ASPBI",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Establishment Surveys",
    section: "Business and Industry",
    frequency: ProjectFrequency.ANNUAL,
    priority: ProjectPriority.HIGH
  },
  {
    name: "Mapping Activities",
    code: "MAP",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Census, Sampling Frames, and Community-Based Monitoring System",
    section: "Mapping and Geospatial",
    frequency: ProjectFrequency.AD_HOC,
    priority: ProjectPriority.MEDIUM
  },
  {
    name: "Foreign Trade Statistics",
    code: "FTS",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Administrative Data",
    section: "Trade Statistics",
    frequency: ProjectFrequency.MONTHLY,
    priority: ProjectPriority.MEDIUM
  },
  {
    name: "Building Permits",
    code: "BP",
    category: ProjectCategory.STATISTICAL_OPERATIONS,
    subcategory: "Administrative Data",
    section: "Construction Statistics",
    frequency: ProjectFrequency.MONTHLY,
    priority: ProjectPriority.MEDIUM
  },
  {
    name: "PHILSYS",
    code: "PHILSYS",
    category: ProjectCategory.PHILIPPINE_IDENTIFICATION_SYSTEM,
    subcategory: null,
    section: "Civil Registration and PHILSYS",
    frequency: ProjectFrequency.AD_HOC,
    priority: ProjectPriority.HIGH
  },
  {
    name: "Administrative Reports",
    code: "ADMIN-RPT",
    category: ProjectCategory.ADMINISTRATIVE_ACCOUNTING_REPORTS,
    subcategory: null,
    section: "Administrative Unit",
    frequency: ProjectFrequency.MONTHLY,
    priority: ProjectPriority.MEDIUM
  },
  {
    name: "Accounting Reports",
    code: "ACCT-RPT",
    category: ProjectCategory.ADMINISTRATIVE_ACCOUNTING_REPORTS,
    subcategory: null,
    section: "Finance and Accounting",
    frequency: ProjectFrequency.MONTHLY,
    priority: ProjectPriority.MEDIUM
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("Admin12345!", 12);
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@ioms.local"
    },
    update: {
      name: "System Administrator",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true
    },
    create: {
      email: "admin@ioms.local",
      passwordHash,
      name: "System Administrator",
      role: "SUPER_ADMIN",
      isActive: true
    }
  });

  const personnel = [];

  for (const person of personnelData) {
    const record = await prisma.personnel.upsert({
      where: {
        employeeNo: person.employeeNo
      },
      update: {
        ...person,
        isActive: true
      },
      create: {
        ...person,
        isActive: true
      }
    });

    personnel.push(record);
  }

  for (const [index, projectSeed] of projectData.entries()) {
    const focalPerson = personnel[index % personnel.length];
    const assignedPerson = personnel[(index + 1) % personnel.length];
    const scenario = taskScenarios[index];
    const progress = calculateProjectProgress(scenario);
    const projectStatus = calculateProjectCycleStatus({ progress, isActive: true }, scenario, new Date());

    const project = await prisma.project.upsert({
      where: {
        code: projectSeed.code
      },
      update: {
        name: projectSeed.name,
        description: `${projectSeed.name} monitoring record for Phase 1 dashboard validation.`,
        category: projectSeed.category,
        subcategory: projectSeed.subcategory,
        section: projectSeed.section,
        year: new Date().getFullYear(),
        frequency: projectSeed.frequency,
        priority: projectSeed.priority,
        workloadWeight: 1 + index * 0.2,
        estimatedMandays: 20 + index * 3,
        status: projectStatus,
        isActive: true,
        updatedById: admin.id
      },
      create: {
        name: projectSeed.name,
        code: projectSeed.code,
        description: `${projectSeed.name} monitoring record for Phase 1 dashboard validation.`,
        category: projectSeed.category,
        subcategory: projectSeed.subcategory,
        section: projectSeed.section,
        year: new Date().getFullYear(),
        frequency: projectSeed.frequency,
        priority: projectSeed.priority,
        workloadWeight: 1 + index * 0.2,
        estimatedMandays: 20 + index * 3,
        status: projectStatus,
        isActive: true,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    for (const assignment of [
      {
        personnelId: focalPerson.id,
        roleInProject: "Focal Person",
        isFocalPerson: true
      },
      {
        personnelId: assignedPerson.id,
        roleInProject: "Other Involved Personnel",
        isFocalPerson: false
      }
    ]) {
      await prisma.projectPersonnel.upsert({
        where: {
          projectId_personnelId: {
            projectId: project.id,
            personnelId: assignment.personnelId
          }
        },
        update: assignment,
        create: {
          projectId: project.id,
          ...assignment
        }
      });
    }

    const cycle = await prisma.projectCycle.upsert({
      where: {
        projectId_cycleName_year: {
          projectId: project.id,
          cycleName: "Initial Monitoring Cycle",
          year: new Date().getFullYear()
        }
      },
      update: {
        deadline: scenario.find((task) => task.deadline)?.deadline ?? null,
        progress,
        status: projectStatus,
        remarks: "Seeded Phase 1 monitoring cycle.",
        isActive: true
      },
      create: {
        projectId: project.id,
        cycleName: "Initial Monitoring Cycle",
        month: projectSeed.frequency === ProjectFrequency.MONTHLY ? new Date().getMonth() + 1 : null,
        quarter: projectSeed.frequency === ProjectFrequency.QUARTERLY ? Math.floor(new Date().getMonth() / 3) + 1 : null,
        year: new Date().getFullYear(),
        startDate: addDays(-20),
        deadline: scenario.find((task) => task.deadline)?.deadline ?? null,
        progress,
        status: projectStatus,
        responseRate: Math.min(100, 45 + index * 5),
        totalSamplesDocuments: 100 + index * 25,
        remarks: "Seeded Phase 1 monitoring cycle.",
        isActive: true
      }
    });

    for (const [taskIndex, task] of scenario.entries()) {
      await prisma.projectTask.upsert({
        where: {
          projectCycleId_taskName: {
            projectCycleId: cycle.id,
            taskName: task.taskName
          }
        },
        update: {
          assignedPersonnelId: taskIndex === 0 ? focalPerson.id : assignedPerson.id,
          startDate: addDays(-15 + taskIndex * 2),
          deadline: task.deadline,
          dateSubmitted: task.dateSubmitted,
          progress: task.progress,
          status: task.status,
          responseRate: task.status === "NO_DEADLINE" ? null : Math.min(100, 40 + index * 4 + taskIndex * 8),
          totalSamplesDocuments: 50 + index * 10 + taskIndex * 5,
          remarks: task.remarks,
          isActive: true
        },
        create: {
          projectCycleId: cycle.id,
          taskName: task.taskName,
          assignedPersonnelId: taskIndex === 0 ? focalPerson.id : assignedPerson.id,
          startDate: addDays(-15 + taskIndex * 2),
          deadline: task.deadline,
          dateSubmitted: task.dateSubmitted,
          progress: task.progress,
          status: task.status,
          responseRate: task.status === "NO_DEADLINE" ? null : Math.min(100, 40 + index * 4 + taskIndex * 8),
          totalSamplesDocuments: 50 + index * 10 + taskIndex * 5,
          remarks: task.remarks,
          isActive: true
        }
      });
    }

    const existingRemark = await prisma.projectRemark.findFirst({
      where: {
        projectId: project.id,
        remarkText: "Seeded initial monitoring remark for dashboard validation."
      }
    });

    if (!existingRemark) {
      await prisma.projectRemark.create({
        data: {
          projectId: project.id,
          authorId: admin.id,
          remarkText: "Seeded initial monitoring remark for dashboard validation."
        }
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SEED",
      entityType: "Database",
      entityId: "phase-1"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
