import { Request, Response } from 'express';
import * as request from 'request-promise-native';

import { Controller, GET, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { TeamSpeak } from 'src/services/teamspeak';
import { Slack } from 'src/services/slack';
import config from 'src/config';

@Controller('/miner')
class MinerController {
    // Forwarder
    @GET()
    public payout(req: Request, res: Response) {
        request.get('https://api.coin-hive.com/stats/payout?secret=4fLxizpcemTbi7TuG5iNP6dYmfQCIn9D', { json: true })
        .then((response) => {
            res.send(response);
        });
    }

    // Forwarder
    @GET()
    public site(req: Request, res: Response) {
        request.get('https://api.coin-hive.com/stats/site?secret=4fLxizpcemTbi7TuG5iNP6dYmfQCIn9D', { json: true })
        .then((response) => {
            res.send(response);
        });
    }
}

export default new MinerController();
