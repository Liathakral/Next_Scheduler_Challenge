-- CreateTable
CREATE TABLE "public"."Availability" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Availability_sellerId_idx" ON "public"."Availability"("sellerId");

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
