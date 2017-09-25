// Add current dir to the module path so we can import from root
require('app-module-path').addPath(__dirname);

import { Server } from './src/server';

const server = new Server();
server.config(null);
server.printRoutes();
