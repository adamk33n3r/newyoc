import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as Scheduler from 'node-schedule';

import debug from 'src/logger';
import config from 'src/config';
import { Clink } from 'src/services/clink';
import { IQuote } from 'src/api/services/clink/types';
import { buildQuoteSection } from 'src/api/services/clink/utils';

function sendQOTD() {
    if (!config.slack.clink.qotd.enabled) {
        return;
    }
    debug('Starting QOTD job');
    const clink = new Clink();
    const teamId = config.slack.clink.teamId;
    firebase.firestore().collection(`teams/${teamId}/quotes`).get().then((query) => {
        const randIdx = Math.floor(Math.random() * query.size);
        const quote = query.docs[randIdx].data() as IQuote;

        const block = buildQuoteSection(quote);
        block.unshift({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*Good morning, everyone. Here's your Quote of the Day!*`,
            },
        });
        clink.sendMessage(config.slack.clink.qotd.channel, '', block);
    });
}

export = (scheduler: typeof Scheduler) => {
    scheduler.scheduleJob('0 0 9 * * *', () => {
        sendQOTD();
    });
};
