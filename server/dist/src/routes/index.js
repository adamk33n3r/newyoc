"use strict";
const base_1 = require("./base");
/**
 * / route
 *
 * @class User
 */
class IndexRoute extends base_1.BaseRoute {
    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    static create(router) {
        // log
        console.log('[IndexRoute::create] Creating index routes.');
        // add home page route
        router.get('/', (req, res, next) => {
            new IndexRoute().index(req, res);
        });
    }
    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    index(req, res) {
        // set message
        const options = {
            'message': 'Welcome to the Tour of Heros',
        };
        // render template
        res.send(options);
    }
}
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/routes/index.js.map