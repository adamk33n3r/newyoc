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

export function getQuotesBlocks(teamId: string, shareChannel: string, filteredUser?: string, page: number = 1, countPerPage: number = 2) {
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
            const quoteSection = buildQuoteSection(quote, shareChannel, true, page, filteredUser);
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
                            text: ':no_entry_sign: Clear',
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
                            text: '<< Prev',
                            emoji: true,
                        },
                        action_id: 'quotes:prev',
                        value: [page, filteredUser].join(','),
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Next >>',
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

export function buildQuoteSection(quote: IQuote, channel: string, withOptions: true, page: number, filteredUser: string): any[];
export function buildQuoteSection(quote: IQuote, channel: string, withOptions?: false): any[];
// tslint:disable-next-line: max-line-length
export function buildQuoteSection(quote: IQuote, channel: string, withOptions: boolean = false, page?: number, filteredUser?: string): any[] {
    const ts = quote.timestamp.toDate();
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*<@${quote.said_by}> said...*\n\n${quote.quote}`,
            },
            // accessory: withOptions ? {
            //     type: 'overflow',
            //     action_id: 'quotes:overflow',
            //     confirm: {
            //         title: {
            //             type: 'plain_text',
            //             text: 'Confirmation',
            //             emoji: true,
            //         },
            //         text: {
            //             type: 'plain_text',
            //             text: 'Are you sure?',
            //             emoji: true,
            //         },
            //         confirm: {
            //             type: 'plain_text',
            //             text: 'Yes',
            //             emoji: true,
            //         },
            //         deny: {
            //             type: 'plain_text',
            //             text: 'Cancel',
            //             emoji: true,
            //         },
            //     },
            //     options: [
            //         {
            //             text: {
            //                 type: 'plain_text',
            //                 text: `:outbox_tray: Share in #${channel}`,
            //                 emoji: true,
            //             },
            //             value: `share,${quote.id}`,
            //         },
            //         {
            //             text: {
            //                 type: 'plain_text',
            //                 text: `:wastebasket: Delete`,
            //                 emoji: true,
            //             },
            //             value: `delete,${quote.id}`,
            //         },
            //     ],
            // } : undefined,
        },
        (withOptions ? {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: `:outbox_tray: Share in #${channel}`,
                        emoji: true,
                    },
                    action_id: 'quotes:share',
                    value: quote.id,
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: ':wastebasket: Delete',
                        emoji: true,
                    },
                    style: 'danger',
                    action_id: 'quotes:delete',
                    value: [quote.id, page, filteredUser].join(','),
                    confirm: {
                        title: {
                            type: 'plain_text',
                            text: 'Delete Confirmation',
                            emoji: true,
                        },
                        text: {
                            type: 'plain_text',
                            text: 'Are you sure you want to delete this quote?',
                            emoji: true,
                        },
                        confirm: {
                            type: 'plain_text',
                            text: 'DELETE',
                            emoji: true,
                        }
                    },
                },
            ],
        } : undefined),
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
    ].filter((obj) => obj);
}
