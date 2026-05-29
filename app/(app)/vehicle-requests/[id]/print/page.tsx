import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/vehicle/PrintButton";
import { VehicleRequestStatusBadge } from "@/components/vehicle/VehicleRequestStatusBadge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRequestSchedule, formatVehicleLabel, isVehicleAdmin } from "@/lib/vehicle-scheduling";

type PrintPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function VehicleRequestPrintPage({ params }: PrintPageProps) {
  const [user, resolvedParams] = await Promise.all([requireUser(), params]);
  const request = await db.vehicleRequest.findUnique({
    where: { id: resolvedParams.id },
    include: {
      requester: true,
      assignedVehicle: true,
      passengers: {
        include: {
          personnel: true
        }
      }
    }
  });

  if (!request) {
    notFound();
  }

  const canView = isVehicleAdmin(user.role) || user.personnelId === request.requesterPersonnelId;
  if (!canView) {
    throw new Error("You can only print your own vehicle requests.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-white text-slate-950 print:max-w-none print:space-y-4 print:bg-white print:p-0">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href="/vehicle-requests">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <PrintButton />
      </div>

      <section className="rounded-lg border border-slate-300 bg-white p-8 shadow-sm print:border-slate-400 print:shadow-none">
        <header className="border-b border-slate-300 pb-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide">Republic of the Philippines</p>
          <p className="text-sm font-semibold uppercase tracking-wide">Philippine Statistics Authority</p>
          <p className="text-sm font-semibold uppercase tracking-wide">Misamis Oriental</p>
          <h1 className="mt-5 text-2xl font-bold uppercase tracking-wide">Vehicle Use Request Form</h1>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Requesting Employee</p>
            <p className="mt-1 text-lg font-semibold">{request.requester.fullName}</p>
            <p className="text-sm text-slate-600">{request.requester.position}</p>
            <p className="text-sm text-slate-600">{request.requester.section}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
            <div className="mt-2">
              <VehicleRequestStatusBadge status={request.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">Generated: {format(new Date(), "MMMM d, yyyy h:mm a")}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-md border border-slate-300 md:grid-cols-2">
          {[
            ["Travel date / time", formatRequestSchedule(request)],
            ["Purpose", request.purpose],
            ["Destination", request.destination],
            ["Assigned vehicle", formatVehicleLabel(request.assignedVehicle)],
            ["SO number/reference", request.soNumber || "Pending assignment"],
            ["SO hard copy", request.soFileUrl ? "Attached" : "Pending assignment"]
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 p-4 odd:bg-white">
              <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-6 rounded-md border border-slate-300 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Other Employees Joining the Travel</h2>
          {request.passengers.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">None listed.</p>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {request.passengers.map((passenger) => (
                <li key={passenger.id} className="rounded border border-slate-200 p-3 text-sm">
                  <p className="font-medium">{passenger.personnel.fullName}</p>
                  <p className="text-slate-600">{passenger.personnel.position}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {(request.adminNotes || request.rejectionReason) && (
          <section className="mt-6 rounded-md border border-slate-300 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Administrative Notes</h2>
            {request.adminNotes && <p className="mt-3 whitespace-pre-wrap text-sm">{request.adminNotes}</p>}
            {request.rejectionReason && (
              <p className="mt-3 whitespace-pre-wrap text-sm">
                <span className="font-semibold">Rejection reason:</span> {request.rejectionReason}
              </p>
            )}
          </section>
        )}

        <footer className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="border-t border-slate-400 pt-2 text-center text-sm">Requested by</div>
          <div className="border-t border-slate-400 pt-2 text-center text-sm">Reviewed / Approved by</div>
        </footer>
      </section>
    </div>
  );
}
