import { Request, Response } from 'express';

function renameFunction(fn: Function, newName: string, args: any = {}) {
    const renamedFunction = fn.toString().replace(/function \w+/, 'function ' + newName);
    const argNames = Object.keys(args);
    const argVals = argNames.map(argName => args[argName]);
    return new Function(...argNames, 'return ' + renamedFunction)(...argVals);
}

/**
 * Checks the request body for token. Responds with 404 if not equal
 */
export function CheckToken(token: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origFn = descriptor.value as Function;

        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function checkToken(req: Request, res: Response) {
            if (req.headers['token'] !== token && req.body.token !== token) {
                res.status(404).send();
            } else {
                origFn.call(this, req, res);
            }
        };

        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { origFn, token });
    };
}

export function Required(...params: string[]) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origFn = descriptor.value as Function;

        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function required(req: Request, res: Response) {
            const valid = params.every((param) => {
                return param in req.body || param in req.query;
            });
            if (valid) {
                origFn.call(this, req, res);
            } else {
                res.status(400).send(`Required params: ${params.join(',')}`);
            }
        };

        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { origFn, params });
    };
}
