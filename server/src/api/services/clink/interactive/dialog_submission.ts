import * as request from 'request-promise-native';

import { ISlackInteractionDialog } from '../types';
import { saveNewQuote } from '../utils';

export function handleDialogSubmission(payload: ISlackInteractionDialog) {
    switch (payload.callback_id) {
        case 'quote':
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
            break;
        default:
            break;
    }
}
