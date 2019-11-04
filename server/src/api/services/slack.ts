import { Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { Controller, POST, GET } from 'src/decorators/routing';
import { Required, VerifySlackSignature } from 'src/decorators/util';

import { TeamSpeak } from 'src/services/teamspeak';
import { Clink } from 'src/services/clink';
import config from 'src/config';

import { ISlackInteraction, IQuote, IGif } from './clink/types';
import { launchQuoteDialog, getQuotesBlocks, getGifAuth, getGif } from './clink/utils';
import { handleMessageAction } from './clink/interactive/message_action';
import { handleDialogSubmission } from './clink/interactive/dialog_submission';
import { handleBlockActions } from './clink/interactive/block_actions';

@Controller('/slack')
class SlackController {
    private clink = new Clink();

    @POST()
    @VerifySlackSignature(config.slack.clink.secret)
    public status(req: Request, res: Response) {
        const ts = new TeamSpeak(config.teamspeak.url);
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
        this.clink.sendMessage(req.body.channel || '#tcpi', req.body.text || 'No text provided')
        .then((response) => {
            console.log(response);
            if (response.ok) {
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
    @VerifySlackSignature(config.slack.clink.secret)
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
    @Required('email')
    public sendInvite(req: Request, res: Response) {
        this.clink.sendInvite(config.slack.token, req.body.email)
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

    @POST()
    @Required('text')
    @VerifySlackSignature(config.slack.clink.secret)
    public quote(req: Request, res: Response) {
        const text: string = req.body.text;
        const splits = text.split(' ');
        const matches = splits[0].match(/^<@(\w+)(?:\|(.+?))?>/);
        const saidBy = matches ? matches[1] : undefined;
        const quote = splits.slice(1).join(' ');

        launchQuoteDialog(req.body.trigger_id, new Date(), saidBy, quote);
        res.send();
    }

    @POST()
    @VerifySlackSignature(config.slack.clink.secret)
    public quotes(req: Request, res: Response) {
        getQuotesBlocks(req.body.team_id, req.body.channel_name, req.body.user_id).then((blocks) => {
            res.send({
                response_type: 'ephemeral',
                blocks,
            });
        });
    }

    @POST()
    @VerifySlackSignature(config.slack.clink.secret)
    public randomQuote(req: Request, res: Response) {
        const teamId = req.body.team_id;
        firebase.firestore().collection(`teams/${teamId}/quotes`).get().then((query) => {
            const randIdx = Math.floor(Math.random() * query.size);
            const quote = query.docs[randIdx].data() as IQuote;

            res.send({
                response_type: 'in_channel',
                text: `<@${quote.said_by}>: ${quote.quote}`,
            });
        });
    }

    @POST()
    @Required('payload')
    @VerifySlackSignature(config.slack.clink.secret)
    public interactive(req: Request, res: Response) {
        const payload = JSON.parse(req.body.payload) as ISlackInteraction;

        switch (payload.type) {
            case 'message_action':
                handleMessageAction(payload);
                res.send();
                break;
            case 'dialog_submission':
                handleDialogSubmission(payload, res);
                break;
            case 'block_actions':
                handleBlockActions(payload);
                res.send();
                break;
            default:
                res.send();
                break;
        }
    }

    @GET()
    public async auth(req: Request, res: Response) {
        const code = req.query.code;
        const id = config.slack.clink.client_id;
        const secret = config.slack.clink.client_secret;
        const redUri = req.protocol + '://' + req.get('host') + '/api/services/slack/auth';
        const uri = `https://slack.com/api/oauth.access?client_id=${id}&client_secret=${secret}&code=${code}&redirect_uri=${redUri}`;
        const result = await request.post(uri, { json: {} });

        const token = result.access_token;
        const userId = result.user_id;
        const teamId = result.team_id;
        await firebase.app('gifs').firestore().collection(`teams/${teamId}/auth`).doc(userId).set({
            token,
        });
        res.redirect('/gifs');
    }

    @POST()
    @Required('text')
    @VerifySlackSignature(config.slack.clink.secret)
    public async gif(req: Request, res: Response) {
        const teamId = req.body.team_id;
        const text: string = req.body.text.toLowerCase();

        const auth = await getGifAuth(teamId, req.body.user_id);
        if (!auth.exists) {
            const id = config.slack.clink.client_id;
            const uri = req.protocol + '://' + req.get('host') + '/api/services/slack/auth';
            const scope = 'chat:write:user';
            const authUri = `https://slack.com/oauth/authorize?client_id=${id}&scope=${scope}&redirect_uri=${uri}&team=${teamId}`;
            res.send({
                response_type: 'ephemeral',
                text: `You have not authorized yet. Please click <${authUri}|HERE> and follow instructions.`,
            });
            return;
        }

        if (text === '') {
            res.send({
                response_type: 'ephemeral',
                text: 'Oops! You didn\'t provide any text!',
            });
            return;
        }

        try {
            const fileUrl = await getGif(teamId, text);

            request.post('https://slack.com/api/chat.postEphemeral?', {
                headers: {
                    Authorization: `Bearer ${config.slack.clink.token}`,
                },
                json: {
                    user: req.body.user_id,
                    channel: req.body.channel_id,
                    attachments: [{
                        blocks: [
                            {
                                type: 'section',
                                text: {
                                    type: 'mrkdwn',
                                    text: `<${fileUrl}|*${text}*>`,
                                },
                            },
                            {
                                type: 'image',
                                title: {
                                    type: 'plain_text',
                                    text: 'Posted using /gif | GIF by YOC',
                                    emoji: false,
                                },
                                image_url: fileUrl,
                                alt_text: text,
                            },
                            {
                                type: 'divider',
                            },
                            {
                                type: 'actions',
                                elements: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        text: {
                                            type: 'plain_text',
                                            text: 'Send',
                                            emoji: true,
                                        },
                                        value: `${text}|${fileUrl}`,
                                        action_id: 'gifs:send',
                                    },
                                    {
                                        type: 'button',
                                        text: {
                                            type: 'plain_text',
                                            text: 'Shuffle',
                                            emoji: true,
                                        },
                                        value: text,
                                        action_id: 'gifs:shuffle',
                                    },
                                    {
                                        type: 'button',
                                        text: {
                                            type: 'plain_text',
                                            text: 'Cancel',
                                            emoji: true,
                                        },
                                        value: 'cancel',
                                        action_id: 'gifs:cancel',
                                    },
                                ],
                            },
                        ],
                    }],
                },
            }).catch((err) => console.error(err));

            res.send();
        } catch (e) {
            if (e instanceof Error) {
                res.send({
                    response_type: 'ephemeral',
                    text: e.message,
                });
            } else {
                res.send({
                    response_type: 'ephemeral',
                    text: 'Unknown error ocurred.',
                });
            }
            return;
        }
    }

}

export default new SlackController();
