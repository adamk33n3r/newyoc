"use strict";
const express_1 = require("express");
require("reflect-metadata");
const DEBUG = false;
function debug(...args) {
    if (!DEBUG) {
        return;
    }
    console.log.apply(console, args);
}
function camelToKebab(name) {
    return name
        .replace(/^([A-Z])/, (matches) => {
        return matches[0].toLowerCase();
    })
        .replace(/([a-z])([A-Z])/g, (matches) => {
        return matches[0] + '-' + matches[1].toLowerCase();
    });
}
function Router(info) {
    return (target) => {
        Reflect.defineMetadata('$router.path', info.path, target.prototype);
        // Create router
        const expressRouter = express_1.Router();
        debug('erouter', expressRouter);
        // Attach controllers to router
        if (info.controllers) {
            debug('registering controllers to', info.path);
            for (const controller of info.controllers) {
                const controllerRouter = express_1.Router();
                const routes = Reflect.getMetadata('$router.routes', controller);
                const path = Reflect.getMetadata('$router.path', controller);
                debug(path);
                for (const routeInfo of routes) {
                    const controllerMethod = controller[routeInfo.propertyKey];
                    debug(`router at ${path} is calling .${routeInfo.method}('${routeInfo.path}', ${controllerMethod.name})`);
                    controllerRouter[routeInfo.method](routeInfo.path, controllerMethod.bind(controller));
                }
                debug(`router at ${info.path} is calling .use('${path}', controllerRouter)`);
                expressRouter.use(path, controllerRouter);
            }
        }
        // Attach routers to router
        if (info.routers) {
            for (const router of info.routers) {
                const path = Reflect.getMetadata('$router.path', router);
                const childRouter = Reflect.getMetadata('$router.router', router);
                debug(`router at ${info.path} is calling .use('${path}', childRouter)`);
                expressRouter.use(path, childRouter);
            }
        }
        // debug(expressRouter.stack);
        Reflect.defineMetadata('$router.router', expressRouter, target.prototype);
    };
}
exports.Router = Router;
function Controller(path) {
    return (target) => {
        Reflect.defineMetadata('$router.path', path, target.prototype);
    };
}
exports.Controller = Controller;
/**
 * @param method The HTTP Verb e.g. GET, POST, etc.
 * @param path Optional path to use for route. If not specified, function name will be used.
 */
function Route(method, path) {
    return (target, propertyKey, descriptor) => {
        if (!Reflect.hasMetadata('$router.routes', target)) {
            Reflect.defineMetadata('$router.routes', [], target);
        }
        const routes = Reflect.getMetadata('$router.routes', target);
        path = path || `/${camelToKebab(propertyKey)}`;
        routes.push({ method, path, propertyKey });
        Reflect.defineMetadata('$router.routes', routes, target);
    };
}
exports.Route = Route;
exports.GET = Route.bind(null, 'get');
exports.POST = Route.bind(null, 'post');
exports.PUT = Route.bind(null, 'put');
//# sourceMappingURL=C:/cygwin/home/Adam/projects/newyoc/server/src/decorators/routing.js.map