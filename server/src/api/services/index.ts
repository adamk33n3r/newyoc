import teamspeak from './teamspeak';
import slack from './slack';
import stream from './stream';
import apiAi from './api-ai';
import miner from './miner';

import { Router } from 'src/decorators/routing';

@Router({
    path: '/services',
    controllers: [
        teamspeak,
        slack,
        stream,
        apiAi,
        miner,
    ],
})
class ServicesRouter {}
export default new ServicesRouter();
