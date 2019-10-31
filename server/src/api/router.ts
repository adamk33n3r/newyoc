// Routes
import { Router } from 'src/decorators/routing';
import services from './services';

import quotes from './quotes';
import gifs from './gifs';

@Router({
    path: '/api',
    routers: [
        services,
    ],
    controllers: [
        quotes,
        gifs,
    ],
})
class AppRouter {}
export default new AppRouter();
