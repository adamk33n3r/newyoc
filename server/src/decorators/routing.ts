import { Router as ExpressRouter } from 'express';
import 'reflect-metadata';

const DEBUG = false;
function debug(...args: any[]) {
    if (!DEBUG) {
        return;
    }
    console.log.apply(console, args);
}

interface RouterDecorator {
    path: string;
    controllers?: any[];
    routers?: any[];
}
export function Router(info: RouterDecorator) {
    return (target: any) => {
        Reflect.defineMetadata('$router.path', info.path, target.prototype);
        // Create router
        const expressRouter = ExpressRouter();
        debug('erouter', expressRouter);

        // Attach controllers to router
        if (info.controllers) {
            debug('registering controllers to', info.path);
            for (const controller of info.controllers) {
                const controllerRouter = ExpressRouter();
                const routes: RouteInfo[] = Reflect.getMetadata('$router.routes', controller);
                const path: string = Reflect.getMetadata('$router.path', controller);
                debug(path);
                for (const routeInfo of routes) {
                    const controllerMethod = controller[routeInfo.propertyKey];
                    debug(`router at ${path} is calling .${routeInfo.method}('${routeInfo.path}', ${controllerMethod.name})`);
                    (<any> controllerRouter)[routeInfo.method](routeInfo.path, controllerMethod.bind(controller));
                }
                debug(`router at ${info.path} is calling .use('${path}', controllerRouter)`);
                expressRouter.use(path, controllerRouter);
            }
        }

        // Attach routers to router
        if (info.routers) {
            for (const router of info.routers) {
                const path: string = Reflect.getMetadata('$router.path', router);
                const childRouter: ExpressRouter = Reflect.getMetadata('$router.router', router);
                debug(`router at ${info.path} is calling .use('${path}', childRouter)`);
                expressRouter.use(path, childRouter);
            }
        }
        debug(expressRouter.stack);
        Reflect.defineMetadata('$router.router', expressRouter, target.prototype);
    };
}

export function Controller(path: string) {
    return (target: any) => {
        Reflect.defineMetadata('$router.path', path, target.prototype);
    };
}

interface RouteFactory {
    (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): void;
}

interface RouteInfo {
    method: string;
    path: string;
    propertyKey: string;
}

/**
 * @param method The HTTP Verb e.g. GET, POST, etc.
 * @param path Optional path to use for route. If not specified, function name will be used.
 */
export function Route(method: string, path?: string): RouteFactory {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!Reflect.hasMetadata('$router.routes', target)) {
            Reflect.defineMetadata('$router.routes', [], target);
        }
        const routes: RouteInfo[] = Reflect.getMetadata('$router.routes', target);
        path = path || `/${propertyKey}`;
        routes.push({ method, path , propertyKey });
        Reflect.defineMetadata('$router.routes', routes, target);
    };
}

type MethodRoute = (path?: string) => RouteFactory;
export const GET: MethodRoute = Route.bind(null, 'get');
export const POST: MethodRoute = Route.bind(null, 'post');
export const PUT: MethodRoute = Route.bind(null, 'put');
