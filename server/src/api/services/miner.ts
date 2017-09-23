import { Request, Response } from 'express';
import * as request from 'request-promise-native';

import { Controller, GET, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { TeamSpeak } from 'src/services/teamspeak';
import { Slack } from 'src/services/slack';
import config from 'src/config';

@Controller('/miner')
class MinerController {
    @GET()
    public payout(req: Request, res: Response) {
        this.coinHiveForwarder('stats/payout', res);
    }

    @GET()
    public site(req: Request, res: Response) {
        this.coinHiveForwarder('stats/site', res);
    }

    @GET()
    @Required('user')
    public balance(req: Request, res: Response) {
        this.coinHiveForwarder('user/balance', res, { name: req.query.user }, (response) => {
            response.balance = response.balance / 100;
            return response;
        });
    }

    private coinHiveForwarder(endpoint: string, res: Response, params: any = {}, then: (response: any) => any = response => response) {
        params.secret = config.coinhive.secret;
        return request.get(`https://api.coin-hive.com/${endpoint}`, {
            qs: params,
            json: true,
        })
        .then(then)
        .then((response) => {
            res.send(response);
        });
    }
}

export default new MinerController();
