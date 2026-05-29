import { db } from "@/lib/db";
import { type MonitoringProject } from "@/lib/project-metrics";
import { MonitoringMiddlePane } from "@/components/dashboard/MonitoringMiddlePane";
import { MonitoringRightPane } from "@/components/dashboard/MonitoringRightPane";
import { getCurrentUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isSuperAdmin = checkUserPermission(user, "manage", "project");

  const projects = await db.project.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      frequency: true,
      year: true,
      status: true,
      isActive: true,
      updatedAt: true,
      personnel: {
        select: {
          isFocalPerson: true,
          roleInProject: true,
          personnel: {
            select: {
              fullName: true
            }
          }
        }
      },
      cycles: {
        select: {
          id: true,
          cycleName: true,
          startDate: true,
          deadline: true,
          dateSubmitted: true,
          progress: true,
          status: true,
          isActive: true,
          totalSamplesDocuments: true,
          responseRate: true,
          updatedAt: true,
          tasks: {
            select: {
              id: true,
              taskName: true,
              deadline: true,
              dateSubmitted: true,
              progress: true,
              status: true,
              isActive: true,
              manualStatusOverride: true,
              totalSamplesDocuments: true,
              responseRate: true,
              remarks: true,
              updatedAt: true,
              assignedPersonnel: {
                select: {
                  fullName: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const monitoringProjects = projects as MonitoringProject[];

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8 flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Middle Pane */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col pt-6">
        <MonitoringMiddlePane 
          activeProjects={monitoringProjects}
          isSuperAdmin={isSuperAdmin}
        />
      </div>

      {/* Right Pane */}
      <div className="hidden xl:block overflow-hidden h-full">
        <MonitoringRightPane />
      </div>
    </div>
  );
}
