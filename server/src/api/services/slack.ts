import { Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import * as fuzzysort from 'fuzzysort';

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
import { ChannelListResponseData } from 'node-ts';

@Controller('/slack')
class SlackController {
    private clink = new Clink();

    @POST()
    @VerifySlackSignature(config.slack.clink.secret)
    public async status(req: Request, res: Response) {
        const ts = new TeamSpeak(config.teamspeak.url);
        try {
            await ts.login(config.teamspeak.username, config.teamspeak.password);
            const onlineClients = await ts.getOnlineClients();
            const connectURL = 'TeamSpeak Server\n<ts3server://yoc|Click here to connect!>\n';
            if (onlineClients.length > 0) {
                res.send({
                    response_type: 'ephemeral',
                    text: connectURL + 'Online users: ' +
                        onlineClients.map((client) => {
                            const awayMessage = client.client_away_message || 'Away';
                            return client.client_nickname + (client.client_away ? ` [${awayMessage}]` : '');
                        }).join(', '),
                });
            } else {
                res.send({
                    response_type: 'ephemeral',
                    text: connectURL + 'No one is online at the moment',
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    @POST('/ts-invite')
    @VerifySlackSignature(config.slack.clink.secret)
    public async teamSpeakInvite(req: Request, res: Response) {
        const sendMessage = async (link: string) => {
            const message = `<@${req.body.user_id}> has invited you to join the YOC TeamSpeak server!\n<${link}|Click here to join!>\n`;
            try {
                const response = await this.clink.sendMessage(req.body.channel_id, message)
                if (response.ok) {
                    res.send();
                } else {
                    console.error(response);
                    res.status(500).send(response);
                }
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        }
        const channelName = req.body.text;
        if (channelName) {
            const ts = new TeamSpeak(config.teamspeak.url);
            try {
                await ts.login(config.teamspeak.username, config.teamspeak.password);
                const channels = await ts.getChannels();
                const results = fuzzysort.go(channelName, channels, { key: 'channel_name', threshold: -1000 });
                const foundChannel = results[0];
                if (foundChannel) {
                    sendMessage(`ts3server://yoc?cid=${foundChannel.obj.cid}`);
                } else {
                    res.send({
                        response_type: 'ephemeral',
                        text: `No channel found with name: ${channelName}`,
                    });
                }
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            sendMessage('ts3server://yoc');
        }
    }

    @POST()
    public async sendMessage(req: Request, res: Response) {
        try {
            const response = await this.clink.sendMessage(req.body.channel || '#tcpi', req.body.text || 'No text provided')
            console.log(response);
            if (response.ok) {
                res.json({ success: true, body: response.body });
            } else {
                console.error(response);
                res.status(500).send(response);
            }
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
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
    public async sendInvite(req: Request, res: Response) {
        try {
            const response = await this.clink.sendInvite(config.slack.token, req.body.email)
            const body = JSON.parse(response.body);
            if (body.ok) {
                res.json({ success: true, body });
            } else {
                console.error(body.error);
                res.json({ success: false, body });
            }
        } catch (err) {
            console.error(err.statusCode);
            res.status(500).send();
        }
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
    public async quotes(req: Request, res: Response) {
        const blocks = await getQuotesBlocks(req.body.team_id, req.body.channel_name, req.body.user_id);
        res.send({
            response_type: 'ephemeral',
            blocks,
        });
    }

    @POST()
    @VerifySlackSignature(config.slack.clink.secret)
    public async randomQuote(req: Request, res: Response) {
        const teamId = req.body.team_id;
        const query = await firebase.firestore().collection(`teams/${teamId}/quotes`).get();
        const randIdx = Math.floor(Math.random() * query.size);
        const quote = query.docs[randIdx].data() as IQuote;

        res.send({
            response_type: 'in_channel',
            text: `<@${quote.said_by}>: ${quote.quote}`,
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
