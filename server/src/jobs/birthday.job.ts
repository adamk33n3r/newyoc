import * as request from 'request-promise-native';
import { Slack } from '../services/slack';
import config from '../config';
const ManagementClient = require('auth0').ManagementClient;

export = function(scheduler: any) {
    const slack = new Slack();
    scheduler.scheduleJob('0 0 9 * * *', () => {
        console.log('birthday job running...');
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
            management.getUsers({ q: `user_metadata.birthday:"${today}/*" OR user_metadata.birthday:"${todayPad}/*"` }).then((users: any[]) => {
              for (const user of users) {
                  const meta = user.user_metadata;
                  const name = meta.name || `${meta.given_name} ${meta.family_name}` || user.name;
                  console.log('Birthday boy:', name);
                  slack.sendMessage(config.slack.webhook, {
                      channel: '#announcements',
                      text: `Happy Birthday to ${name}! :beers:`,
                  });
              }
            }).catch((err: any) => console.error(err));
        });
    });
}
