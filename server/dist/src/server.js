"use strict";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("reflect-metadata");
// routes
const router_1 = require("./api/router");
/**
 * The server.
 *
 * @class Server
 */
class Server {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // instance defaults
        this.model = Object(); // initialize this to an empty object
        // create expressjs application
        this.app = express();
        // configure application
        this.config();
        // add routes
        this.routes();
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {
        // Add static paths
        this.app.use(express.static(path.join(__dirname, 'public')));
        // Mount logger
        this.app.use(logger('dev'));
        // Mount json form parser
        this.app.use(bodyParser.json());
        // Mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        // Mount cookie parker
        this.app.use(cookieParser('i am so secret'));
        // Mount override
        this.app.use(methodOverride());
        // Use native promises
        mongoose.Promise = Promise;
        // Connect to mongoose
        // const connection: mongoose.Connection = mongoose.createConnection(Server.MONGODB_CONNECTION);
        // Create models
        // this.model.user = connection.model<IUserModel>('User', userSchema);
        // Catch 404 and forward to error handler
        this.app.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
        // Error handling
        this.app.use(errorHandler());
    }
    /**
     * Create and return Router.
     *
     * @class Server
     * @method config
     * @return void
     */
    routes() {
        const router = Reflect.getMetadata('$router.router', router_1.default);
        const path = Reflect.getMetadata('$router.path', router_1.default);
        this.app.use(path, router);
    }
}
Server.MONGODB_CONNECTION = 'mongodb://eon.adam-keenan.net:27272/newyoc';
exports.Server = Server;
//# sourceMappingURL=C:/cygwin/home/Adam/projects/newyoc/server/src/server.js.map