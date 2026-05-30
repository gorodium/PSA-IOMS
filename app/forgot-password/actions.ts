"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import crypto from "crypto";

export async function forgotPasswordAction(formData: FormData) {
  const identifier = formData.get("identifier")?.toString();

  if (!identifier) {
    redirect(`/forgot-password?message=${encodeURIComponent("If this account exists, password reset instructions have been sent.")}`);
  }

  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });

  if (user && user.isActive) {
    // We would normally send an email here.
    // Instead, we will log that a reset was requested and generate a token.
    // In a real system with an email server, we'd mail it out.
    // For this intranet system, the admin can manually reset it.
    
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
      }
    });

    await writeAuditLog({
      userId: user.id,
      action: "FORGOT_PASSWORD_REQUEST",
      entityType: "User",
      entityId: user.id
    });

    // Notify admins via chat
    const adminChannel = await db.chatChannel.findFirst({
      where: { channelType: "ADMIN_REQUESTS", isActive: true }
    });

    if (adminChannel) {
      await db.chatMessage.create({
        data: {
          channelId: adminChannel.id,
          messageType: "REQUEST_NOTIFICATION",
          body: `Password reset requested for user: ${user.name} (${user.username})`,
          relatedEntityType: "User",
          relatedEntityId: user.id,
          metadataJson: {
            requestType: "Password Reset",
            actorName: user.name,
            actionLabel: "Requested a password reset",
            details: {
              "User": user.name,
              "Username": user.username,
              "Email": user.email ?? "N/A"
            }
          }
        }
      });
    }
  }

  // Always return the same generic message to prevent user enumeration
  redirect(`/forgot-password?message=${encodeURIComponent("If this account exists, password reset instructions have been sent. If you do not receive an email, please contact your System Administrator to reset it manually.")}`);
}
