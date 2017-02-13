import { Request, Response } from 'express';

/**
 * Checks the request body for token. Responds with 404 if not equal
 */
export function CheckToken(token: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origFn = descriptor.value as Function;

        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function (req: Request, res: Response) {
            if (req.body.token !== token) {
                res.status(404).send();
            } else {
                origFn.call(this, req, res);
            }
        };
    };
}

export function Required(...params: string[]) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origFn = descriptor.value as Function;

        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function (req: Request, res: Response) {
            const valid = params.every((param) => {
                return param in req.body;
            });
            if (valid) {
                origFn.call(this, req, res);
            } else {
                res.status(400).send(`Required params: ${params.join(',')}`);
            }
        };
    };
}
