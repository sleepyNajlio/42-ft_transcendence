/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Player" (
    "id_player" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAuthenticated" BOOLEAN DEFAULT false,
    "level" INTEGER NOT NULL DEFAULT 1,
    "status" "PlayerStatus" NOT NULL DEFAULT 'OFFLINE',
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "twofa" BOOLEAN DEFAULT false,
    "twoFASecret" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id_player")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_avatar_key" ON "Player"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
