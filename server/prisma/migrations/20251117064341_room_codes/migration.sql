-- CreateTable
CREATE TABLE "RoomCodes" (
    "id" SERIAL NOT NULL,
    "longRoomId" TEXT NOT NULL,
    "shortRoomId" TEXT NOT NULL,

    CONSTRAINT "RoomCodes_pkey" PRIMARY KEY ("id")
);
