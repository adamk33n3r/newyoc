import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { TeamSpeak } from 'src/services/teamspeak';
import { Slack } from 'src/services/slack';
import config from 'src/config';

@Controller('/slack')
class SlackController {
    private slack = new Slack();

    @GET()
    public status(req: Request, res: Response) {
        const ts = this.initTeamSpeak();
        ts.login(config.teamspeak.username, config.teamspeak.password)
        .then(() => {
            ts.getOnlineClients()
            .then((onlineClients: any[]) => {
                const connectURL = 'TeamSpeak Server\n<ts3server://ts.adam-keenan.com|Click here to connect!>\n';
                if (onlineClients.length > 0) {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'Online users: ' +
                            onlineClients.map((ele) => {
                                return ele.client_nickname;
                            }).join(', '),
                    });
                } else {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'No one is online at the moment',
                    });
                }
            })
            .catch((err) => res.status(500).send(err));
        })
        .catch((err) => res.status(500).send(err));
    }

    @POST()
    public sendMessage(req: Request, res: Response) {
        this.slack.sendMessage(config.slack.webhook, {
            channel: req.body.channel || '#tcpi',
            text: req.body.text || 'No text provided',
        })
        .then((response) => {
            if (response.body === 'ok') {
                res.json({ success: true, body: response.body });
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

    @POST()
    @Required('text')
    @CheckToken('LwPEBbxlGiNTXzXG7Ag92Efo')
    public roll(req: Request, res: Response) {
        const sides = req.body.text.split(' ')[0];
        if (sides) {
            const result = Math.floor(Math.random() * +sides) + 1;
            if (!result) {
                return res.status(500).send('Sides parameter invalid');
            }
            res.send({
                response_type: 'in_channel',
                text: result,
            });
        } else {
            res.status(500).send('Sides parameter invalid');
        }
    }

    @POST()
    @CheckToken('HEiSGKnFX8aGHXezPxnER2Mg')
    public lenny(req: Request, res: Response) {
        res.send({
            response_type: 'in_channel',
            text: ' ',
        });
    }

    @POST()
    @Required('email')
    public sendInvite(req: Request, res: Response) {
        if (!this.slack) {
            console.error(this.slack);
            return res.send(500, 'uh');
        }
        this.slack.sendInvite(config.slack.token, req.body.email)
        .then((response) => {
            const body = JSON.parse(response.body);
            if (body.ok) {
                res.json({ success: true, body });
            } else {
                console.error(body.error);
                res.json({ success: false, body });
            }
        })
        .catch((err) => {
            console.error(err.statusCode);
            res.status(500).send();
        });
    }

    private initTeamSpeak(): TeamSpeak {
        return new TeamSpeak(config.teamspeak.url);
    }
}

export default new SlackController();
