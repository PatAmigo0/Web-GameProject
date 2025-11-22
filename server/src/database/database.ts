import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export class DatabasePostgreSQL {
	public prisma;

	constructor() {
		const connectionString = process.env.DATABASE_URL;
		const pool = new Pool({ connectionString });
		const adapter = new PrismaPg(pool);

		this.prisma = new PrismaClient({ adapter });
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

	public insertUser(login: string, hashed_password: string, uuid: string) {
		return this.prisma.user.create({
			data: {
				username: login,
				passwordHash: hashed_password,
				uuid: uuid,
			},
		});
	}

	public findUniqueUser(username: string) {
		return this.prisma.user.findUnique({
			where: { username: username },
		});
	}
}
