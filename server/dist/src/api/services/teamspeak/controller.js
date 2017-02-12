"use strict";
const base_route_1 = require("src/api/base-route");
class TeamSpeakController extends base_route_1.BaseRoute {
    /**
     * The home page route.
     *
     * @class TeamSpeakController
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     */
    static index(req, res) {
        // set message
        const options = {
            'message': 'Welcome to the Tour of Heros',
        };
        // render template
        res.send(options);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamSpeakController;
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/api/services/teamspeak/controller.js.map