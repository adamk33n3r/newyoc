import { Router as ExpressRouter, Request, Response } from 'express';
import 'reflect-metadata';

const DEBUG = false;
function debug(...args: any[]) {
    if (!DEBUG) {
        return;
    }
    console.log.apply(console, args);
}

function camelToKebab(name: string) {
    return name
    // Lowercase first character
    .replace(/^([A-Z])/, (matches) => {
        return matches[0].toLowerCase();
    })
    // Turn rest into kebab
    .replace(/([a-z])([A-Z])/g, (matches) => {
        return matches[0] + '-' + matches[1].toLowerCase()
    });
}

function renameFunction(fn: Function, newName: string, args: any = {}) {
    const renamedFunction = fn.toString().replace(/function \w+/, 'function ' + newName);
    const argNames = Object.keys(args);
    const argVals = argNames.map(argName => args[argName]);
    return new Function(...argNames, 'return ' + renamedFunction)(...argVals);
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
                    debug(`controller router at ${path} is calling .${routeInfo.method}('${routeInfo.path}', ${controllerMethod.name})`);

                    // If a response wasn't sent (function just returned) then send one.
                    // NEVERMIND. Controller routes can be async so this res.send would happen first...BAD
                    //function sendByDefault(req: Request, res: Response) {
                    //    controllerMethod.call(controller, req, res);
                    //    if (!res.headersSent) {
                    //        res.send();
                    //    }
                    //}
                    //const newFunc = renameFunction(sendByDefault, controllerMethod.name, { controllerMethod, controller });
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
        // debug(expressRouter.stack);
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
        path = path || (propertyKey === 'index' ? '/' : `/${camelToKebab(propertyKey)}`);
        routes.push({ method, path, propertyKey });
        Reflect.defineMetadata('$router.routes', routes, target);
    };
}

type MethodRoute = (path?: string) => RouteFactory;
export const GET: MethodRoute = Route.bind(null, 'get');
export const POST: MethodRoute = Route.bind(null, 'post');
export const PUT: MethodRoute = Route.bind(null, 'put');
