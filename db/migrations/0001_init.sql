-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'INSTITUTION', 'DONOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "studentAddr" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "courseHash" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Credential_hash_key" ON "Credential"("hash");

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "studentAddr" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipFund" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "donor" TEXT NOT NULL,
    "amountXlm" DOUBLE PRECISION NOT NULL,
    "remaining" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScholarshipFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "student" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_studentAddr_fkey"
    FOREIGN KEY ("studentAddr") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Reward" ADD CONSTRAINT "Reward_studentAddr_fkey"
    FOREIGN KEY ("studentAddr") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_fundId_fkey"
    FOREIGN KEY ("fundId") REFERENCES "ScholarshipFund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
