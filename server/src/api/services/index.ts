import teamspeak from './teamspeak';
import slack from './slack';
import stream from './stream';

import { Router } from 'src/decorators/routing';

@Router({
    path: '/services',
    controllers: [
        teamspeak,
        slack,
        stream,
    ],
})
class ServicesRouter {}
export default new ServicesRouter();
