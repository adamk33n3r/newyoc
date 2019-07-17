import { Request, Response } from 'express';

import { Controller, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { Clink } from 'src/services/clink';
import config from 'src/config';

@Controller('/stream')
class StreamController {
    private clink = new Clink();

    @POST('/')
    public index(req: Request, res: Response) {
        if (req.body.name !== 'default') {
            res.send();
            return;
        }
        switch (req.body.call) {
            case 'publish':
                const silent = req.body.silent;
                const channel = req.body.channel;
                if (typeof silent === 'undefined' || silent === null) {
                    const who = req.body.who || 'Someone';
                    const title = req.body.title || 'something';
                    this.clink.sendMessage(
                        channel || '#random',
                        `${who} started streaming *${title}*!\nCome join the party: https://yoc.gg/stream\nChat in #stream`,
                    );
                }
                break;
            default: break;
        }
        res.send();
    }
}

export default new StreamController();
