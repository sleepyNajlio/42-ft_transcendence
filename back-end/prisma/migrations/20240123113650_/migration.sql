-- CreateTable
CREATE TABLE "_mutedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_mutedUsers_AB_unique" ON "_mutedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedUsers_B_index" ON "_mutedUsers"("B");

-- AddForeignKey
ALTER TABLE "_mutedUsers" ADD CONSTRAINT "_mutedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id_chat") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUsers" ADD CONSTRAINT "_mutedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id_player") ON DELETE CASCADE ON UPDATE CASCADE;
