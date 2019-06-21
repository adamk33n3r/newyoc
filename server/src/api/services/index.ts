import teamspeak from './teamspeak';
import slack from './slack';
import stream from './stream';
import apiAi from './api-ai';
import civ6 from './civ6';

import { Router } from 'src/decorators/routing';

@Router({
    path: '/services',
    controllers: [
        teamspeak,
        slack,
        stream,
        apiAi,
        civ6,
    ],
})
class ServicesRouter {}
export default new ServicesRouter();
