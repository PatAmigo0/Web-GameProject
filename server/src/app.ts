import app from '@app';
import { listen } from '@colyseus/tools';
import { loadenv } from '@utils/loadenv.util';

loadenv();
listen(app);
