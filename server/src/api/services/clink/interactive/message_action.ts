import { ISlackInteractionAction } from '../types';
import { launchQuoteDialog } from '../utils';

export function handleMessageAction(payload: ISlackInteractionAction) {
    switch (payload.callback_id) {
        case 'quote':
            const saidBy = payload.message.user;
            const quote = payload.message.text;
            const timestamp = new Date(+(payload.message.ts.split('.')[0] + '000'));
            launchQuoteDialog(payload.trigger_id, timestamp, saidBy, quote);
            break;
        default:
            break;
    }
}
