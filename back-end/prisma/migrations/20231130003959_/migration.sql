/*
  Warnings:

  - The primary key for the `ChatMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_chat_message` on the `ChatMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_pkey",
DROP COLUMN "id_chat_message",
ADD COLUMN     "id3_chat_message" SERIAL NOT NULL,
ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id3_chat_message");

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "isAuthenticated" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_hash_key" ON "Player"("hash");
