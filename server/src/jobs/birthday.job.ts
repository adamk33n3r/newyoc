import * as request from 'request-promise-native';

import debug from 'src/logger';

import { Slack } from '../services/slack';
import config from '../config';
const ManagementClient = require('auth0').ManagementClient;

export = (scheduler: any) => {
    const slack = new Slack();
    debug('scheduling birthday job');
    scheduler.scheduleJob('0 0 9 * * *', () => {
        debug('birthday job running...');
        if (!(config.auth0 && config.auth0.client_id && config.auth0.client_secret)) {
            console.error('no auth0 config can\'t send birthday messages');
            return;
        }
        request.post({
            url: 'https://adamk33n3r.auth0.com/oauth/token',
            headers: { 'Content-Type': 'application/json' },
            body: {
                grant_type: 'client_credentials',
                client_id: config.auth0.client_id,
                client_secret: config.auth0.client_secret,
                audience: 'https://adamk33n3r.auth0.com/api/v2/'
            },
            json: true,
        }).then((response) => {
            const management = new ManagementClient({
                token: response.access_token,
                domain: 'adamk33n3r.auth0.com',
            });
            const date = new Date();
            const today = `${date.getMonth() + 1}/${date.getDate()}`;
            const todayPad = `0${date.getMonth() + 1}/${date.getDate()}`;
            management.getUsers()
                .then((users: any[]) => {
                    return users.filter((user) => {
                        return user.user_metadata.birthday.startsWith(today) || user.user_metadata.birthday.startsWith(todayPad);
                    });
                })
                .then((users: any[]) => {
                    if (users.length === 0) {
                        console.log('No birthdays today :(');
                        return;
                    }
                    for (const user of users) {
                        const meta = user.user_metadata;
                        const name = meta.slack || meta.name || `${meta.given_name} ${meta.family_name}` || user.name;
                        console.log('Birthday boy:', name, meta.birthday);
                        slack.sendMessage(config.slack.webhook, {
                            channel: '#tcpi',
                            text: `:tada::confetti_ball::birthday: Happy Birthday to ${name}!!! :birthday::confetti_ball::tada:`,
                        });
                    }
                }).catch((err: any) => console.error(err));
        });
    });
}
