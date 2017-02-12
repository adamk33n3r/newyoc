// Routes
import services from './services';

import { Router } from 'src/decorators/routing';
@Router({
    path: '/api',
    routers: [
        services,
    ],
})
class AppRouter {}
export default new AppRouter();
