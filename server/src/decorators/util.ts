import { Request, Response } from 'express';

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
        const renamedFunction = descriptor.value.toString().replace('function checkToken', 'function ' + origFn.name);
        descriptor.value = new Function('origFn', 'token', 'return ' + renamedFunction)(origFn, token);
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
        const renamedFunction = descriptor.value.toString().replace('function required', 'function ' + origFn.name);
        descriptor.value = new Function('origFn', 'params', 'return ' + renamedFunction)(origFn, params);
    };
}
