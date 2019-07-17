// Routes
import { Router } from 'src/decorators/routing';
import services from './services';

import quotes from './quotes';

@Router({
    path: '/api',
    routers: [
        services,
    ],
    controllers: [
        quotes,
    ],
})
class AppRouter {}
export default new AppRouter();
