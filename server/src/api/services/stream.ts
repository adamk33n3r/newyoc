import { Request, Response } from 'express';

import { Controller, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { Slack } from 'src/services/slack';
import config from 'src/config';

@Controller('/stream')
class StreamController {
    private slack = new Slack();

    @POST('/')
    public index(req: Request, res: Response) {
        if (req.body.name !== 'default') {
            return;
        }
        switch (req.body.call) {
            case 'publish':
                const silent = req.body.silent;
                const channel = req.body.channel;
                if (typeof silent === 'undefined' || silent === null) {
                    const who = req.body.who || 'Someone';
                    const title = req.body.title || 'something';
                    this.slack.sendMessage(config.slack.webhook, {
                        channel: channel || '#random',
                        text: `${who} started streaming *${title}*!\nCome join the party: https://yoc.adam-keenan.com/stream`,
                    });
                }
                break;
            default: break;
        }
        res.send();
    }
}

export default new StreamController();