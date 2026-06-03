"use server";

import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function uploadCustomEmojiAction(formData: FormData) {
  try {
    const user = await requireUser();
    if (user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const file = formData.get("file") as File | null;

    if (!name || name.trim() === "" || /\s/.test(name)) {
      return { ok: false, message: "Emoji name is required and cannot contain spaces (use underscores)" };
    }

    if (!file || file.size === 0) {
      return { ok: false, message: "Image file is required" };
    }

    if (!file.type.startsWith("image/")) {
      return { ok: false, message: "Only image files (including GIFs) are allowed" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { ok: false, message: "Emoji image must be less than 2MB" };
    }

    const existing = await db.customEmoji.findUnique({ where: { name } });
    if (existing) {
      return { ok: false, message: `Emoji name '${name}' is already taken` };
    }

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "png";
    const fileName = `emoji-${name}-${timestamp}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/emojis");
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

    const imageUrl = `/uploads/emojis/${fileName}`;

    await db.customEmoji.create({
      data: {
        name,
        imageUrl,
        createdById: user.id
      }
    });

    revalidatePath("/settings/emojis");
    
    return { ok: true, message: "Custom emoji uploaded successfully" };
  } catch (error) {
    console.error("Failed to upload custom emoji:", error);
    return { ok: false, message: "An unexpected error occurred" };
  }
}

export async function deleteCustomEmojiAction(emojiId: string) {
  try {
    const user = await requireUser();
    if (user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "Unauthorized" };
    }

    const emoji = await db.customEmoji.findUnique({ where: { id: emojiId } });
    if (!emoji) {
      return { ok: false, message: "Emoji not found" };
    }

    // Try to delete file
    try {
      const fileName = emoji.imageUrl.split("/").pop();
      if (fileName) {
        const filePath = path.join(process.cwd(), "public/uploads/emojis", fileName);
        await unlink(filePath);
      }
    } catch (e) {
      console.warn("Failed to delete emoji file:", e);
    }

    await db.customEmoji.delete({ where: { id: emojiId } });

    revalidatePath("/settings/emojis");
    
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete custom emoji:", error);
    return { ok: false, message: "Failed to delete" };
  }
}
