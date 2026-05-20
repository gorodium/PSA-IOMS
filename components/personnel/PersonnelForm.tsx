import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { personnelSectionOptions } from "@/lib/taxonomy";

type PersonnelFormRecord = {
  id: string;
  employeeNo: string | null;
  fullName: string;
  position: string;
  section: string;
  email: string | null;
  contactNo: string | null;
  isActive: boolean;
};

export function PersonnelForm({
  action,
  personnel
}: {
  action: (formData: FormData) => Promise<void>;
  personnel?: PersonnelFormRecord | null;
}) {
  return (
    <form action={action}>
      {personnel ? <input type="hidden" name="id" value={personnel.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{personnel ? "Edit personnel" : "Add personnel"}</CardTitle>
          <CardDescription>Personnel records are used for assignments and dashboard ownership.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeNo">Employee no.</Label>
              <Input id="employeeNo" name="employeeNo" defaultValue={personnel?.employeeNo ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" defaultValue={personnel?.fullName ?? ""} required />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" defaultValue={personnel?.position ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select id="section" name="section" defaultValue={personnel?.section ?? personnelSectionOptions[0]} required>
                {personnelSectionOptions.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={personnel?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact no.</Label>
              <Input id="contactNo" name="contactNo" defaultValue={personnel?.contactNo ?? ""} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isActive" defaultChecked={personnel?.isActive ?? true} className="rounded border-input text-primary focus:ring-ring" />
            Active personnel
          </label>
          <div>
            <Button type="submit">
              <Save className="h-4 w-4" aria-hidden="true" />
              {personnel ? "Save personnel" : "Create personnel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
