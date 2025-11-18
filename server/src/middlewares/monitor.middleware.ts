import basicAuth from 'express-basic-auth';

const realm = `${crypto.randomUUID()}-Restricted-Area`;
export const monitorMiddleware = basicAuth({
	users: {
		admin: 'root',
	},
	realm: realm,
	challenge: true,
});
