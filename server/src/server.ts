import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as firebase from 'firebase';
import * as fileUpload from 'express-fileupload';
(global as any).XMLHttpRequest = require('xhr2');
import 'reflect-metadata';

const Table = require('cli-table');

import { Socket } from './services/socket';
import { Jobs } from './jobs';
import config from './config';

// routes
import AppRouter from './api/router';

// interfaces
// import { IUser } from './interfaces/user'; // import IUser

// models
// import { IModel } from './models/model'; // import IModel
// import { IUserModel } from './models/user'; // import IUserModel

// schemas
// import { userSchema } from './schemas/user'; // import userSchema

/**
 * The server.
 *
 * @class Server
 */
export class Server {
    private static MONGODB_CONNECTION = 'mongodb://eon.adam-keenan.net:27272/newyoc';

    public app: express.Application;

    // private model: IModel; // an instance of IModel

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // instance defaults
        // this.model = Object(); // initialize this to an empty object

        // create expressjs application
        this.app = express();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config(socket: SocketIO.Server) {
        if (socket) {
            new Socket(socket);
        }

        // Add static paths
        this.app.use(express.static('./src/public'));

        // Mount logger
        this.app.use(logger('dev'));

        // Mount json form parser
        // this.app.use(bodyParser.json());
        this.app.use(bodyParser.json({
            verify(req, res, buf) { (req as any).rawBody = buf.toString(); },
        }));

        // Mount query string parser
        this.app.use(bodyParser.urlencoded({
            verify(req, res, buf) { (req as any).rawBody = buf.toString(); },
            extended: true,
        }));

        // Mount cookie parker
        this.app.use(cookieParser('i am so secret'));

        // Mount override
        this.app.use(methodOverride());

        // Catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        // Error handling
        this.app.use(errorHandler());

        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        this.routes();

        // Firebase
        if (config.firebase) {
            firebase.initializeApp({
                projectId: config.firebase.quotes.projectId,
                databaseURL: config.firebase.quotes.databaseURL,
                storageBucket: config.firebase.quotes.storageBucket,
                locationId: config.firebase.quotes.locationId,
                apiKey: config.firebase.quotes.apiKey,
                authDomain: config.firebase.quotes.authDomain,
                messagingSenderId: config.firebase.quotes.messagingSenderId,
                appId: config.firebase.quotes.appId,
            });
            firebase.initializeApp({
                projectId: config.firebase.gifs.projectId,
                databaseURL: config.firebase.gifs.databaseURL,
                storageBucket: config.firebase.gifs.storageBucket,
                locationId: config.firebase.gifs.locationId,
                apiKey: config.firebase.gifs.apiKey,
                authDomain: config.firebase.gifs.authDomain,
                messagingSenderId: config.firebase.gifs.messagingSenderId,
                appId: config.firebase.gifs.appId,
            }, 'gifs');
        }

        // Jobs
        if (socket) {
            Jobs.init();
        }

    }

    public printRoutes() {
        const stack = this.app._router.stack as any[];
        const table = new Table({ head: ['VERB', 'PATH', 'METHOD']});
        this.getRoutesFromStack(stack, table);
        console.log(table.toString());
    }

    /**
     * Create and return Router.
     *
     * @class Server
     * @method config
     * @return void
     */
    private routes() {
        const router: express.Router = Reflect.getMetadata('$router.router', AppRouter);
        const routePath: string = Reflect.getMetadata('$router.path', AppRouter);
        this.app.use(routePath, router);
        // This static path is only used in production
        const pathToClient = path.join(__dirname, '../../../../client/dist');
        this.app.use(express.static(pathToClient));
        // tslint:disable-next-line
        this.app.get('*', function catchAll(req, res) {
            res.sendFile(path.join(pathToClient, 'index.html'));
        });
    }

    private getRoutesFromStack(stack: any[], table: any, path: string = '') {
        for (const layer of stack) {
            if (layer.name === 'router') {
                // console.log(layer, layer.regexp, layer.handle.stack);q
                // console.log(layer.)
                let routerPath = (layer.regexp as RegExp).toString();
                routerPath = routerPath
                    .replace('/^', '')
                    .replace('\\/?(?=\\/|$)/i', '')
                    .replace('\\/', '/');
                this.getRoutesFromStack(layer.handle.stack, table, path + routerPath);
            } else if (layer.route) {
                const methodName = layer.route.stack[0].handle.name.replace('bound ', '');
                const httpMethod = (layer.route.stack[0].method as string).toUpperCase();
                const fullPath = path + layer.route.path;
                table.push([httpMethod, fullPath, methodName]);
            }
        }
    }
}
