ALTER TABLE "ConvocationGroupMember"
ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS "ConvocationGroupMember_isAvailable_idx"
ON "ConvocationGroupMember"("isAvailable");
