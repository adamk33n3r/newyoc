"use strict";
class BaseRoute {
    /**
     * Constructor
     *
     * @class BaseRoute
     * @constructor
     */
    constructor() {
    }
    /**
     * Render a page.
     *
     * @class BaseRoute
     * @method render
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @return void
     */
    index(req, res) {
        res.send('BaseRoute: Route not set up yet.');
    }
}
exports.BaseRoute = BaseRoute;
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/routes/base.js.map