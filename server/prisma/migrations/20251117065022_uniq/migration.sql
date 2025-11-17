/*
  Warnings:

  - A unique constraint covering the columns `[shortRoomId]` on the table `RoomCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoomCodes_shortRoomId_key" ON "RoomCodes"("shortRoomId");
