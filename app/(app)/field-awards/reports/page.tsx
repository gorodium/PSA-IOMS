import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, FileBarChart } from "lucide-react";
import { getActiveCycleWithRubric } from "@/lib/field-awards/queries";

export default async function ReportsPage() {
  const activeContext = await getActiveCycleWithRubric();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Management Reports</CardTitle>
          <CardDescription>Export performance data and gap analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
            <Card className="shadow-none border-slate-200">
              <CardHeader className="pb-3">
                <FileBarChart className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-base">Gap Analysis Report</CardTitle>
                <CardDescription className="text-xs">Identifies categories with the largest recoverable weighted-score gaps.</CardDescription>
              </CardHeader>
              <CardContent>
                <button 
                  disabled={!activeContext}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </button>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200">
              <CardHeader className="pb-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-base">Full Score Matrix</CardTitle>
                <CardDescription className="text-xs">Complete hierarchy with unweighted ratings, formulas, and final weighted points.</CardDescription>
              </CardHeader>
              <CardContent>
                <button 
                  disabled={!activeContext}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Export XLSX
                </button>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200">
              <CardHeader className="pb-3">
                <FileSpreadsheet className="h-8 w-8 text-slate-500 mb-2" />
                <CardTitle className="text-base">Evidence Tracker</CardTitle>
                <CardDescription className="text-xs">Status of all documentary requirements, including missing evidence and deadlines.</CardDescription>
              </CardHeader>
              <CardContent>
                <button 
                  disabled={!activeContext}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Export XLSX
                </button>
              </CardContent>
            </Card>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
