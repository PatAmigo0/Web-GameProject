import { PrismaClient } from '@prisma/client';

export class DatabasePostgreSQL {
	public prisma!: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	public clearRoomCodes() {
		return this.prisma.roomCodes.deleteMany({});
	}

	public findUniqueRoomByCode(shortCode: string) {
		return this.prisma.roomCodes.findUnique({ where: { shortRoomId: shortCode } });
	}

	public insertRoom(shortCode: string, longCode: string) {
		return this.prisma.roomCodes.create({
			data: {
				shortRoomId: shortCode,
				longRoomId: longCode,
			},
		});
	}
}
