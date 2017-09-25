// Routes
import services from './services';
import miner from './miner';

import { Router } from 'src/decorators/routing';
@Router({
    path: '/api',
    routers: [
        services,
    ],
    controllers: [
        miner,
    ],
})
class AppRouter {}
export default new AppRouter();
