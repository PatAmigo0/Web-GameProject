import 'dotenv/config';

import { ServerService } from '@services/ServerService';

export const serverService: ServerService = await new ServerService().start();
