import * as crypto from 'crypto';
import { Request, Response } from 'express';

function renameFunction(fn: Function, newName: string, closureScope: any = {}) {
    const renamedFunction = fn.toString().replace(/function \w+/, 'function ' + newName);
    const argNames = Object.keys(closureScope);
    const argVals = argNames.map(argName => closureScope[argName]);
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
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, token });
    };
}

export function VerifySlackSignature(secret: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origFn = descriptor.value as Function;

        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function checkToken(req: Request, res: Response) {
            const timestamp = req.header('X-Slack-Request-Timestamp');

            // Check if request was within a minute
            const curTime = Math.round(new Date().getTime() / 1000);
            if (curTime - +timestamp > 60) {
                res.status(500).send();
                return;
            }
            const rawBody = (req as any).rawBody;

            const sigBase = `v0:${timestamp}:${rawBody}`;

            const hmac = crypto.createHmac('sha256', secret);
            const calcSig = 'v0=' + hmac.update(sigBase).digest('hex');
            const signature = req.header('X-Slack-Signature');
            if (signature !== calcSig) {
                res.status(500).send();
                return;
            }

            origFn.call(this, req, res);
        };

        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, secret, crypto });
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
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, params });
    };
}
