"use strict";
class BaseRoute {
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
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/api/base-route.js.map