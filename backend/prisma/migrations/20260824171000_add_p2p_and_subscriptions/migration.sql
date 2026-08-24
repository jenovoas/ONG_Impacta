-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerShift" DROP CONSTRAINT "VolunteerShift_missionId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerShift" DROP CONSTRAINT "VolunteerShift_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerShiftAssignment" DROP CONSTRAINT "VolunteerShiftAssignment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerShiftAssignment" DROP CONSTRAINT "VolunteerShiftAssignment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerShiftAssignment" DROP CONSTRAINT "VolunteerShiftAssignment_shiftId_fkey";

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "captureId" TEXT,
ADD COLUMN     "chargeReference" TEXT,
ADD COLUMN     "p2pPageId" TEXT,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT,
ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "membershipExpiresAt",
DROP COLUMN "membershipStatus",
DROP COLUMN "membershipTier",
DROP COLUMN "publishToDirectory";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Ticket";

-- DropTable
DROP TABLE "VolunteerShift";

-- DropTable
DROP TABLE "VolunteerShiftAssignment";

-- DropEnum
DROP TYPE "MembershipInterval";

-- DropEnum
DROP TYPE "MembershipStatus";

-- DropEnum
DROP TYPE "MembershipTier";

-- CreateTable
CREATE TABLE "CampaignP2PPage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "personalGoal" DECIMAL(15,2),
    "currentAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignP2PPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringSubscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "campaignId" TEXT,
    "frequency" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "nextChargeAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "captureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignP2PPage_organizationId_slug_key" ON "CampaignP2PPage"("organizationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringSubscription_captureId_key" ON "RecurringSubscription"("captureId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_captureId_key" ON "Donation"("captureId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_chargeReference_key" ON "Donation"("chargeReference");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_p2pPageId_fkey" FOREIGN KEY ("p2pPageId") REFERENCES "CampaignP2PPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "RecurringSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignP2PPage" ADD CONSTRAINT "CampaignP2PPage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignP2PPage" ADD CONSTRAINT "CampaignP2PPage_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignP2PPage" ADD CONSTRAINT "CampaignP2PPage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringSubscription" ADD CONSTRAINT "RecurringSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringSubscription" ADD CONSTRAINT "RecurringSubscription_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringSubscription" ADD CONSTRAINT "RecurringSubscription_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

