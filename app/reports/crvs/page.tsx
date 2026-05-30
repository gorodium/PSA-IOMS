import { Construction } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "CRVS | PSA Misamis Oriental",
  description: "Civil Registration and Vital Statistics (CRVS) is currently under construction.",
};

export default function CRVSPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-4xl">
      <Card className="mt-8 border-dashed border-2 shadow-none bg-slate-50 dark:bg-slate-900/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Under Construction</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            The CRVS module is currently being developed. It will be available in a future update to help track and manage Civil Registration and Vital Statistics.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <p className="text-sm text-muted-foreground">
            Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
