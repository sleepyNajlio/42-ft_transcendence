/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FriendShip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_friendId_fkey";

-- DropForeignKey
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_userId_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ChatUser";

-- DropTable
DROP TABLE "FriendShip";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "UserGame";

-- DropEnum
DROP TYPE "ChatRole";

-- DropEnum
DROP TYPE "ChatType";

-- DropEnum
DROP TYPE "GameStatus";

-- DropEnum
DROP TYPE "RelationStatus";
