import React from "react";
import { db as prisma } from "@/lib/db";
import { SpecialOrderClient } from "./SpecialOrderClient";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Special Orders | Reports",
};

export default async function SpecialOrderPage() {
  const user = await getCurrentUser();
  const canSync = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const specialOrders = await prisma.specialOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      people: true
    }
  });

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <SpecialOrderClient initialData={specialOrders as any} canSync={canSync} />
    </div>
  );
}
