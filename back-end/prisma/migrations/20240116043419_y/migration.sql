-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SEARCHING', 'PLAYING', 'FINISHED', 'ABORTED');

-- CreateEnum
CREATE TYPE "RelationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "FriendShip" (
    "status" "RelationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserGame" (
    "id_user_game" SERIAL NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "win" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id_user_game")
);

-- CreateTable
CREATE TABLE "Game" (
    "id_game" SERIAL NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'SEARCHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id_game")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "id_chat_user" SERIAL NOT NULL,
    "role" "ChatRole" NOT NULL DEFAULT 'MEMBER',
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id_chat_user")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id_chat" SERIAL NOT NULL,
    "type" "ChatType" NOT NULL DEFAULT 'PUBLIC',
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id_chat")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id3_chat_message" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id3_chat_message")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendShip_userId_friendId_key" ON "FriendShip"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGame_userId_gameId_key" ON "UserGame"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_userId_chatId_key" ON "ChatUser"("userId", "chatId");

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id_game") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Player"("id_player") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;
