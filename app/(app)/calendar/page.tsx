import { SmartCalendar } from "@/components/calendar/SmartCalendar";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const [personnel, specialOrders] = await Promise.all([
    db.personnel.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" }
    }),
    db.specialOrder.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        soNumber: true,
        purpose: true,
        activityDateString: true,
        activityDate: true
      }
    })
  ]);

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8 flex h-[calc(100vh-64px)] w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] overflow-hidden bg-slate-50 dark:bg-[#0F121A] p-4 md:p-6 lg:p-8">
      <SmartCalendar isAdmin={isAdmin} personnel={personnel} specialOrders={specialOrders} />
    </div>
  );
}
