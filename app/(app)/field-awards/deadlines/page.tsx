import { db } from "@/lib/db";
import { getActiveCycleWithRubric } from "@/lib/field-awards/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isPast, isFuture, isThisWeek } from "date-fns";

export default async function DeadlinesPage() {
  const activeContext = await getActiveCycleWithRubric();
  
  if (!activeContext || !activeContext.rubric) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg border-slate-200">
        <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium">No Active Configuration</h3>
      </div>
    );
  }

  const { rubric } = activeContext;
  
  const requirements = await db.fieldAwardRequirement.findMany({
    where: { 
      node: { rubricVersionId: rubric.id },
      dueDate: { not: null }
    },
    include: { node: { select: { code: true, title: true } } },
    orderBy: { dueDate: 'asc' }
  });

  const now = new Date();
  
  const overdue = requirements.filter(r => r.dueDate && isPast(r.dueDate) && r.dueDate.getTime() !== now.getTime());
  const upcoming = requirements.filter(r => r.dueDate && isFuture(r.dueDate));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Overdue
            </CardTitle>
            <CardDescription className="text-red-600/80">Deadlines that have passed</CardDescription>
          </CardHeader>
          <CardContent>
            {overdue.length === 0 ? (
              <p className="text-sm text-red-600/60 italic">No overdue requirements.</p>
            ) : (
              <div className="space-y-4">
                {overdue.map(req => (
                  <div key={req.id} className="flex justify-between items-start pb-4 border-b border-red-200/50 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-slate-900">{req.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{req.node.code} - {req.node.title}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-sm font-semibold text-red-600">{format(req.dueDate!, "MMM d, yyyy")}</div>
                      <div className="text-xs text-red-500 font-medium">Past Due</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" /> Upcoming
            </CardTitle>
            <CardDescription>Scheduled future deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No upcoming deadlines scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcoming.map(req => {
                  const isSoon = isThisWeek(req.dueDate!);
                  return (
                    <div key={req.id} className="flex justify-between items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{req.title}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">{req.node.code} - {req.node.title}</div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className={`text-sm font-semibold ${isSoon ? "text-orange-600" : ""}`}>
                          {format(req.dueDate!, "MMM d, yyyy")}
                        </div>
                        {isSoon && (
                          <div className="text-xs text-orange-500 font-medium flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> This week
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
