"use server";

import { redirect } from "next/navigation";

export async function dummyAction() {
  // Obsolete route, redirect to the new admin panel
  redirect("/admin/users");
}
