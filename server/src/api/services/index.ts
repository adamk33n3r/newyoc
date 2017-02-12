import teamspeak from './teamspeak';
import slack from './slack';

import { Router } from 'src/decorators/routing';

@Router({
    path: '/services',
    controllers: [
        teamspeak,
        slack,
    ],
})
class ServicesRouter {}
export default new ServicesRouter();
