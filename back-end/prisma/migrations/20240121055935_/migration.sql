/*
  Warnings:

  - The primary key for the `FriendShip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,friendId]` on the table `FriendShip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `FriendShip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_pkey",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FriendShip_userId_friendId_key" ON "FriendShip"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;
