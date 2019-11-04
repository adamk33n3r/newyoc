import * as request from 'request-promise-native';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { ISlackInteractionBlockActions, IQuote } from '../types';
import { getQuotesBlocks, buildQuoteSection, getGif, getGifAuth } from '../utils';
import config from 'src/config';

export async function handleBlockActions(payload: ISlackInteractionBlockActions) {
    const action = payload.actions[0];
    switch (action.type) {
        case 'button':
            switch (action.action_id) {
                case 'quotes:share':
                    firebase.firestore().collection(`teams/${payload.team.id}/quotes`).doc(action.value).get()
                    .then((quoteSnap) => {
                        const quote = quoteSnap.data() as IQuote;
                        request.post(payload.response_url, {
                            json: {
                                delete_original: true,
                                response_type: 'in_channel',
                                text: quote,
                                blocks: buildQuoteSection(quote),
                            },
                        });
                    });
                    break;
                case 'quotes:delete': {
                    const [id, pageNumber, selectedUser] = action.value.split(',');
                    firebase.firestore().collection(`teams/${payload.team.id}/quotes`).doc(id).delete()
                    .then(() => {
                        getQuotesBlocks(payload.team.id, payload.channel.name, payload.user.id, selectedUser, +pageNumber)
                        .then((blocks) => {
                            request.post(payload.response_url, {
                                json: {
                                    replace_original: true,
                                    blocks,
                                },
                            });
                        });
                    });
                    break;
                }
                case 'quotes:next': {
                    const [pageNumber, selectedUser] = action.value.split(',');
                    getQuotesBlocks(payload.team.id, payload.channel.name, payload.user.id, selectedUser, +pageNumber + 1)
                    .then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                }
                case 'quotes:prev': {
                    const [pageNumber, selectedUser] = action.value.split(',');
                    getQuotesBlocks(payload.team.id, payload.channel.name, payload.user.id, selectedUser, +pageNumber - 1)
                    .then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                }
                case 'quotes:close':
                    request.post(payload.response_url, {
                        json: {
                            delete_original: true,
                        },
                    });
                    break;
                case 'quotes:filter:said_by:clear':
                    getQuotesBlocks(payload.team.id, payload.channel.name, payload.user.id).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                case 'gifs:send': {
                    const auth = await getGifAuth(payload.team.id, payload.user.id);
                    const authToken = auth.data().token;
                    const [text, fileUrl] = action.value.split('|');
                    request.post(payload.response_url, {
                        json: {
                            delete_original: true,
                            response_type: 'in_channel',
                        },
                    });
                    request.post('https://slack.com/api/chat.postMessage?', {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                        json: {
                            user: payload.user.id,
                            channel: payload.channel.id,
                            as_user: true,
                            text: `gif: ${text}`,
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
                            ],
                        },
                    }).catch((err) => console.error(err));
                    break;
                }
                case 'gifs:shuffle': {
                    const fileUrl = await getGif(payload.team.id, action.value);
                    request.post(payload.response_url, {
                        json: {
                            replace_original: true,
                            response_type: 'ephemeral',
                            attachments: [{
                                blocks: [
                                    {
                                        type: 'section',
                                        text: {
                                            type: 'mrkdwn',
                                            text: `<${fileUrl}|*${action.value}*>`,
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
                                        alt_text: action.value,
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
                                                value: `${action.value}|${fileUrl}`,
                                                action_id: 'gifs:send',
                                            },
                                            {
                                                type: 'button',
                                                text: {
                                                    type: 'plain_text',
                                                    text: 'Shuffle',
                                                    emoji: true,
                                                },
                                                value: action.value,
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
                    });
                    break;
                }
                case 'gifs:cancel':
                    request.post(payload.response_url, {
                        json: {
                            delete_original: true,
                        },
                    });
                    break;
                default:
                    break;
            }
            break;
        case 'overflow':
            switch (action.action_id) {
                case 'quotes:overflow':
                    const [subAction, id] = action.selected_option.value.split(',');
                    switch (subAction) {
                        case 'share':
                            firebase.firestore().collection(`teams/${payload.team.id}/quotes`).doc(id).get()
                            .then((quoteSnap) => {
                                const quote = quoteSnap.data() as IQuote;
                                request.post(payload.response_url, {
                                    json: {
                                        delete_original: true,
                                        response_type: 'in_channel',
                                        text: quote,
                                        blocks: buildQuoteSection(quote),
                                    },
                                });
                            });
                            break;
                        case 'delete':
                            const dialogObj = {
                                trigger_id: payload.trigger_id,
                                dialog: {
                                    callback_id: 'quote:delete',
                                    title: 'Delete Confirmation',
                                    submit_label: 'Confirm',
                                    // notify_on_cancel: true,
                                    state: action.selected_option.value.replace('delete,', ''),
                                    elements: [
                                        {
                                            type: 'text',
                                            label: 'Verify',
                                            name: 'verify',
                                            value: '',
                                            placeholder: 'Type in RHUBARB',
                                        },
                                    ] as any[],
                                },
                            };
                            request.post('https://slack.com/api/dialog.open', {
                                headers: {
                                    'Authorization': 'Bearer ' + config.slack.clink.token,
                                },
                                json: dialogObj,
                            }).then((res) => {
                                console.log(res);
                            }).catch((err) => {
                                console.error(err);
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'users_select':
            switch (action.action_id) {
                case 'quotes:filter:said_by':
                    getQuotesBlocks(payload.team.id, payload.channel.name, payload.user.id, action.selected_user).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}
