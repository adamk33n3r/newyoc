// Routes
import { Router } from 'src/decorators/routing';
import services from './services';

import miner from './miner';
import quotes from './quotes';

@Router({
    path: '/api',
    routers: [
        services,
    ],
    controllers: [
        miner,
        quotes,
    ],
})
class AppRouter {}
export default new AppRouter();
