import * as request from 'request-promise-native';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import config from 'src/config';
import { IProbabilityObject, IQuote } from './types';

function randomArrayElement(values: IProbabilityObject[]) {
    // Adapted from https://stackoverflow.com/a/44196624/1260715
    let i, pickedValue, threshold = 0;
    const randomNr = Math.random();

    for (i = 0; i < values.length; i++) {
        const val = values[i];
        if (val.probability === '*') {
            continue;
        }

        threshold += val.probability;
        if (threshold > randomNr) {
            pickedValue = values[i].value;
            break;
        }

        if (!pickedValue) {
            // nothing found based on probability value, so pick element marked with wildcard
            pickedValue = values.find((value) => value.probability === '*').value;
        }
    }

    return pickedValue;
}

export function launchQuoteDialog(triggerId: string, timestamp: Date, saidBy?: string, quote?: string): void {
    const titles: IProbabilityObject[] = [
        {
            value: 'FRAMED!',
            probability: 0.1,
        },
        {
            value: 'Quote that PokeMon!',
            probability: 0.1,
        },
        {
            value: 'Create Quote',
            probability: '*',
        },
    ];
    const saidByLabels: IProbabilityObject[] = [
        {
            value: 'Who\'s to blame?',
            probability: 0.1,
        },
        {
            value: 'Who dunnit?',
            probability: 0.1,
        },
        {
            value: 'Said by',
            probability: '*',
        },
    ];
    const dialogObj = {
        trigger_id: triggerId,
        dialog: {
            callback_id: 'quote',
            title: randomArrayElement(titles),
            submit_label: 'Confirm',
            // notify_on_cancel: true,
            state: timestamp.getTime(),
            elements: [
                {
                    type: 'select',
                    label: randomArrayElement(saidByLabels),
                    name: 'saidBy',
                    data_source: 'users',
                    value: saidBy,
                },
                {
                    type: 'textarea',
                    label: 'Quote',
                    name: 'quote',
                    value: quote,
                    placeholder: 'Quote the man...',
                },
            ],
        },
    };
    request.post('https://slack.com/api/dialog.open', {
        headers: {
            'Authorization': 'Bearer ' + config.slack.clink.token,
        },
        json: dialogObj,
    }).then((resp) => {
        if (!resp.ok) {
            console.error(resp);
        }
    }).catch((err) => console.error(err));
}

export function saveNewQuote(teamId: string, saidBy: string, quote: string, quotedBy: string, channel: string, timestamp: Date) {
    return firebase.firestore().collection(`teams/${teamId}/quotes`).add({
        quote,
        said_by: saidBy,
        quoted_by: quotedBy,
        channel,
        timestamp,
    });
}

export function getQuotesBlocks(teamId: string, filteredUser?: string, page: number = 1) {
    const countPerPage = 3;
    let query: firebase.firestore.Query = firebase.firestore().collection(`teams/${teamId}/quotes`)
        .orderBy('timestamp', 'desc')
    ;

    if (filteredUser) {
        query = query.where('said_by', '==', filteredUser);
    }

    return query.get().then((quotes) => {
        return quotes.docs.map((quote) => ({ id: quote.id, ...quote.data() } as IQuote));
    }).then((quotes) => {

        // const firstQuoteTS = quotes[0].timestamp.toDate();
        // const lastQuoteTS = quotes[quotes.length - 1].timestamp.toDate();

        const pageCount = Math.ceil(quotes.length / countPerPage);

        if (page < 1) {
            page = 1;
        }

        if (page > pageCount) {
            page = pageCount;
        }

        const skip = (page - 1) * countPerPage;

        const mappedQuotes = quotes.slice(skip, skip + countPerPage).map((quote) => {
            const quoteSection = buildQuoteSection(quote, true);
            quoteSection.push({ type: 'divider' });
            return quoteSection;
        });

        const filters = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '*Filters*',
                },
            },
            {
                type: 'actions',
                elements: [
                    {
                        type: 'users_select',
                        action_id: 'quotes:filter:said_by',
                        initial_user: filteredUser || undefined,
                        placeholder: {
                            type: 'plain_text',
                            text: 'Filter by user',
                            emoji: true,
                        },
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Clear :no_entry_sign:',
                            emoji: true,
                        },
                        action_id: 'quotes:filter:said_by:clear',
                    },
                ],
            },
        ];

        const pageButtons = [
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `Page ${page} of ${pageCount}`,
                    },
                ],
            },
            {
                type: 'actions',
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: ':arrow_left: Prev',
                            emoji: true,
                        },
                        action_id: 'quotes:prev',
                        value: [page, filteredUser].join(','),
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Next :arrow_right:',
                            emoji: true,
                        },
                        action_id: 'quotes:next',
                        value: [page, filteredUser].join(','),
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Close',
                            emoji: true,
                        },
                        action_id: 'quotes:close',
                    },
                ],
            },
        ];

        const merged = [].concat.apply([], mappedQuotes);
        return [].concat(filters, merged, pageButtons);
    });
}

export function buildQuoteSection(quote: IQuote, withAccessory: boolean = false): any[] {
    const ts = quote.timestamp.toDate();
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*<@${quote.said_by}> said...*\n\n${quote.quote}`,
            },
            accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Share in Channel :outbox_tray:',
                    emoji: true,
                },
                action_id: 'quotes:share',
                value: quote.id,
            },
        },
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `${ts.toDateString()} ${ts.toLocaleTimeString()}`,
                },
                {
                    type: 'mrkdwn',
                    text: `Quoted By <@${quote.quoted_by}>`,
                },
            ],
        },
    ];
}
