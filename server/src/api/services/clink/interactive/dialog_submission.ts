import * as request from 'request-promise-native';
import { Response } from 'express';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { ISlackInteractionDialog } from '../types';
import { saveNewQuote, getQuotesBlocks } from '../utils';

export function handleDialogSubmission(payload: ISlackInteractionDialog, res: Response) {
    console.log(payload);
    switch (payload.callback_id) {
        case 'quote:create': {
            const submissionPayload = payload as ISlackInteractionDialog<{
                quote: string;
                saidBy: string;
            }>;
            const teamId = submissionPayload.team.id;
            const saidBy = submissionPayload.submission.saidBy;
            const quote = submissionPayload.submission.quote;
            const quotedBy = submissionPayload.user.id;
            const channel = submissionPayload.channel.id;
            const timestamp = new Date(+submissionPayload.state);
            saveNewQuote(
                teamId,
                saidBy,
                quote,
                quotedBy,
                channel,
                timestamp,
            ).then((newQuote) => {
                newQuote.get().then((quoteSnap) => {
                    console.log('New Quote Created:', quoteSnap.data());
                });
                request.post(submissionPayload.response_url, {
                    json: {
                        response_type: 'ephemeral',
                        text: `Successfully quoted <@${saidBy}>`,
                    },
                });
            });
            res.send();
            break;
        }
        case 'quote:delete': {
            const submissionPayload = payload as ISlackInteractionDialog<{
                verify: string;
            }>;
            if (submissionPayload.submission.verify !== 'RHUBARB') {
                res.json({
                    errors: [
                        {
                            name: 'verify',
                            error: 'That\'s not RHUBARB!',
                        },
                    ],
                });
                return;
            }
            const [id, pageNumber, selectedUser] = submissionPayload.state.split(',');
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
            res.send();
            break;
        }
        default:
            break;
    }
}
