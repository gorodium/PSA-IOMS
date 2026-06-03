"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function updateSuperAdminProfileAction(formData: FormData) {
  try {
    const user = await requireUser();
    
    // Strict restriction: only SUPER_ADMIN can use this
    if (user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "Unauthorized: Super Admin only" };
    }

    const name = formData.get("name") as string;
    const file = formData.get("photo") as File | null;

    if (!name || name.trim() === "") {
      return { ok: false, message: "Name is required" };
    }

    let photoUrl = user.photoUrl;

    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return { ok: false, message: "Only image files are allowed for profile pictures" };
      }

      if (file.size > 5 * 1024 * 1024) {
        return { ok: false, message: "Image must be less than 5MB" };
      }

      const timestamp = Date.now();
      // use user.id to prevent clashes, and safe file extension
      const ext = file.name.split(".").pop() || "png";
      const fileName = `admin-${user.id}-${timestamp}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/profiles");
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

      photoUrl = `/uploads/profiles/${fileName}`;
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        ...(photoUrl !== user.photoUrl && { photoUrl })
      }
    });

    revalidatePath("/", "layout");
    
    return { ok: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { ok: false, message: "An unexpected error occurred while updating profile" };
  }
}
