import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/vehicle/PrintButton";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatProgramDate } from "@/lib/convocation";

type ConvocationPrintPageProps = {
  params: Promise<{ id: string }>;
};

const institutionalContent = {
  vision: "Solid, responsive, and world-class authority on quality statistics, efficient civil registration, and inclusive identification system.",
  mission: "Deliver relevant and reliable statistics, efficient civil registration services and inclusive identification system for equitable development towards improved quality of life for all.",
  coreValues: ["Integrity", "Transparency", "Adaptability"],
  corporatePersonality: "Professional, Responsive, Innovative, Service-oriented, and Accountable.",
  qualityPolicy:
    "The Philippine Statistics Authority commits to deliver relevant and reliable statistics, efficient civil registration services, and inclusive identification system to our clients and stakeholders.",
  flagPledge:
    "Ako ay Pilipino. Buong katapatang nanunumpa sa watawat ng Pilipinas at sa bansang kaniyang sinasagisag, na may dangal, katarungan at kalayaan na pinakikilos ng sambayanang maka-Diyos, makakalikasan, makatao at makabansa.",
  publicServantPledge:
    "Ako ay kawani ng gobyerno. Tungkulin ko ang maglingkod nang tapat, mahusay, at makatarungan para sa sambayanang Pilipino."
};

export const dynamic = "force-dynamic";

function splitMessageAssignment(value: string) {
  const [name, ...positionParts] = value.split(",");
  return {
    name: name.trim(),
    position: positionParts.join(",").trim()
  };
}

function AssignmentPrintDisplay({ value, itemKey }: { value: string; itemKey?: string }) {
  if (itemKey === "message") {
    const assignment = splitMessageAssignment(value);

    return (
      <span className="inline-block text-center">
        <span className="block font-bold">{assignment.name}</span>
        {assignment.position && (
          <span className="block text-xs font-medium text-slate-600">{assignment.position}</span>
        )}
      </span>
    );
  }

  if (value === "AVP") {
    return (
      <span className="inline-block rounded border border-slate-400 bg-slate-50 px-3 py-1 font-bold">
        AVP
      </span>
    );
  }

  return <span className="font-bold">{value}</span>;
}

export default async function ConvocationPrintPage({ params }: ConvocationPrintPageProps) {
  const resolvedParams = await params;
  const program = await db.convocationProgram.findUnique({
    where: { id: resolvedParams.id },
    include: {
      group: true,
      items: {
        include: { assignedPersonnel: true },
        orderBy: { itemOrder: "asc" }
      }
    }
  });

  if (!program) notFound();

  const assignmentFor = (key: string) => {
    const item = program.items.find((entry) => entry.itemKey === key);
    return item?.assignedPersonnel?.fullName ?? item?.fixedTextValue ?? "To be assigned";
  };

  const enabledItems = program.items.filter((item) => item.isEnabled);

  return (
    <div className="mx-auto max-w-5xl bg-white text-slate-950 print:max-w-none">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/convocation/${program.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <PrintButton />
      </div>

      <div className="space-y-6 print:space-y-0">
        <section className="min-h-[10in] break-after-page rounded-lg border border-slate-300 p-10 print:rounded-none print:border-0">
          <div className="flex h-full flex-col items-center justify-between text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Republic of the Philippines</p>
              <p className="mt-2 text-lg font-semibold uppercase">Philippine Statistics Authority</p>
              <p className="text-base font-semibold uppercase">Misamis Oriental Provincial Statistical Office</p>
            </div>
            <div className="my-24">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Weekly Office Convocation</p>
              <h1 className="mt-5 text-5xl font-bold uppercase tracking-wide">Convocation Program</h1>
              <div className="mx-auto mt-8 h-px w-64 bg-slate-400" />
              <p className="mt-8 text-2xl font-semibold">{formatProgramDate(program.convocationDate)}</p>
              <p className="mt-2 text-lg text-slate-600">Assigned Group: {program.group.name}</p>
            </div>
            <p className="text-sm text-slate-500">Prepared through the Integrated Operations Monitoring System</p>
          </div>
        </section>

        <section className="min-h-[10in] break-after-page rounded-lg border border-slate-300 p-10 print:rounded-none print:border-0">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Institutional Statements</h2>
          <div className="mt-8 grid gap-6">
            <div className="rounded-lg border border-slate-300 p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Vision</h3>
              <p className="mt-3 text-lg leading-8">{institutionalContent.vision}</p>
            </div>
            <div className="rounded-lg border border-slate-300 p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Mission</h3>
              <p className="mt-3 text-lg leading-8">{institutionalContent.mission}</p>
            </div>
            <div className="rounded-lg border border-slate-300 p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Core Values</h3>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {institutionalContent.coreValues.map((value) => (
                  <div key={value} className="rounded-md bg-slate-100 px-4 py-5 text-lg font-semibold">{value}</div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-300 p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Corporate Personality</h3>
              <p className="mt-3 text-lg leading-8">{institutionalContent.corporatePersonality}</p>
            </div>
          </div>
        </section>

        <section className="min-h-[10in] break-after-page rounded-lg border border-slate-300 p-10 print:rounded-none print:border-0">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Pledges and Quality Policy</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-base font-bold uppercase">Panunumpa sa Watawat ng Pilipinas</h3>
              <p className="mt-3 text-lg leading-9">{institutionalContent.flagPledge}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Assigned: {assignmentFor("flag_pledge")}</p>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-base font-bold uppercase">Panunumpa ng Lingkod Bayan</h3>
              <p className="mt-3 text-lg leading-9">{institutionalContent.publicServantPledge}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Assigned: {assignmentFor("lingkod_bayan_pledge")}</p>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-base font-bold uppercase">Quality Policy</h3>
              <p className="mt-3 text-lg leading-9">{institutionalContent.qualityPolicy}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Assigned: {assignmentFor("quality_policy")}</p>
            </div>
          </div>
        </section>

        <section className="min-h-[10in] rounded-lg border border-slate-300 p-10 print:rounded-none print:border-0">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Programme Flow</p>
            <h2 className="mt-2 text-3xl font-bold uppercase">Convocation Program</h2>
            <p className="mt-2 text-lg">{formatProgramDate(program.convocationDate)} | {program.group.name}</p>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-slate-400">
                <th className="w-16 py-3 pr-4 font-bold uppercase">No.</th>
                <th className="py-3 pr-4 font-bold uppercase">Activity</th>
                <th className="py-3 font-bold uppercase">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {enabledItems.map((item, index) => {
                const assignment = item.assignedPersonnel?.fullName ?? item.fixedTextValue ?? "To be assigned";

                return (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                    <td className="py-3 pr-4 font-medium">{item.itemLabel}</td>
                    <td className="py-3"><AssignmentPrintDisplay value={assignment} itemKey={item.itemKey} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-10 grid grid-cols-2 gap-12 text-center text-sm">
            <div className="border-t border-slate-400 pt-2">Prepared by</div>
            <div className="border-t border-slate-400 pt-2">Noted by</div>
          </div>
        </section>
      </div>
    </div>
  );
}
