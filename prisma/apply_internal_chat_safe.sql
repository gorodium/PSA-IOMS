DO $$ BEGIN
  CREATE TYPE "ChatChannelType" AS ENUM ('GENERAL', 'PRIVATE', 'SYSTEM', 'ADMIN_REQUESTS');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ChatChannelMemberRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ChatMessageType" AS ENUM ('USER_MESSAGE', 'SYSTEM_MESSAGE', 'REQUEST_NOTIFICATION', 'REQUEST_STATUS_UPDATE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ChatChannel" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "channelType" "ChatChannelType" NOT NULL DEFAULT 'GENERAL',
  "createdById" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatChannel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ChatChannelMember" (
  "id" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "ChatChannelMemberRole" NOT NULL DEFAULT 'MEMBER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatChannelMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ChatMessage" (
  "id" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "senderUserId" TEXT,
  "messageType" "ChatMessageType" NOT NULL DEFAULT 'USER_MESSAGE',
  "body" TEXT NOT NULL,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "metadataJson" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ChatMessageRead" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessageRead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ChatChannel_name_channelType_key" ON "ChatChannel"("name", "channelType");
CREATE INDEX IF NOT EXISTS "ChatChannel_channelType_idx" ON "ChatChannel"("channelType");
CREATE INDEX IF NOT EXISTS "ChatChannel_isActive_idx" ON "ChatChannel"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "ChatChannelMember_channelId_userId_key" ON "ChatChannelMember"("channelId", "userId");
CREATE INDEX IF NOT EXISTS "ChatChannelMember_userId_idx" ON "ChatChannelMember"("userId");
CREATE INDEX IF NOT EXISTS "ChatChannelMember_isActive_idx" ON "ChatChannelMember"("isActive");
CREATE INDEX IF NOT EXISTS "ChatMessage_channelId_createdAt_idx" ON "ChatMessage"("channelId", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatMessage_senderUserId_idx" ON "ChatMessage"("senderUserId");
CREATE INDEX IF NOT EXISTS "ChatMessage_messageType_idx" ON "ChatMessage"("messageType");
CREATE INDEX IF NOT EXISTS "ChatMessage_relatedEntityType_relatedEntityId_idx" ON "ChatMessage"("relatedEntityType", "relatedEntityId");
CREATE INDEX IF NOT EXISTS "ChatMessage_deletedAt_idx" ON "ChatMessage"("deletedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "ChatMessageRead_messageId_userId_key" ON "ChatMessageRead"("messageId", "userId");
CREATE INDEX IF NOT EXISTS "ChatMessageRead_userId_idx" ON "ChatMessageRead"("userId");
CREATE INDEX IF NOT EXISTS "ChatMessageRead_readAt_idx" ON "ChatMessageRead"("readAt");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatChannel_createdById_fkey') THEN
    ALTER TABLE "ChatChannel" ADD CONSTRAINT "ChatChannel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatChannelMember_channelId_fkey') THEN
    ALTER TABLE "ChatChannelMember" ADD CONSTRAINT "ChatChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatChannelMember_userId_fkey') THEN
    ALTER TABLE "ChatChannelMember" ADD CONSTRAINT "ChatChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatMessage_channelId_fkey') THEN
    ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatMessage_senderUserId_fkey') THEN
    ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatMessageRead_messageId_fkey') THEN
    ALTER TABLE "ChatMessageRead" ADD CONSTRAINT "ChatMessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChatMessageRead_userId_fkey') THEN
    ALTER TABLE "ChatMessageRead" ADD CONSTRAINT "ChatMessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
