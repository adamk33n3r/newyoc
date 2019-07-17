import * as request from 'request-promise-native';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { ISlackInteractionBlockActions, IQuote } from '../types';
import { getQuotesBlocks, buildQuoteSection } from '../utils';

export function handleBlockActions(payload: ISlackInteractionBlockActions) {
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
                                blocks: buildQuoteSection(quote, payload.channel.name),
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
                            break;
                        case 'delete':
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
                    getQuotesBlocks(payload.team.id, payload.channel.name, action.selected_user).then((blocks) => {
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