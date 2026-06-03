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
  
  if (!user) {
    redirect("/login");
  }

  const specialOrders = await prisma.specialOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      people: true
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <SpecialOrderClient initialData={specialOrders} />
    </div>
  );
}
