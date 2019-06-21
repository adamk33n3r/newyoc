import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { Slack } from 'src/services/slack';
import config from 'src/config';

@Controller('/civ6')
class Civ6Controller {
    private slack = new Slack();

    @POST('/')
    public index(req: Request, res: Response) {
        const gameName = req.body.value1;
        const playerName = req.body.value2;
        const turnNumber = req.body.value3;

        this.slack.sendMessage(config.slack.webhook, {
            channel: '#civ6turns',
            text: `It is now ${playerName}'s turn (${turnNumber}) in ${gameName}`,
        })
        .then((response) => {
            if (response.body === 'ok') {
                res.json({ success: true, body: response.body});
            } else {
                console.error(response);
                res.status(500).send(response);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
}

export default new Civ6Controller();
