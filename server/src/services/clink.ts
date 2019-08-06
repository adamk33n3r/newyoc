import * as request from 'request-promise-native';
import config from 'src/config';

export class Clink {
    public sendMessage(channel: string, text: string, blocks?: any[]): request.RequestPromise {
        return request.post('https://slack.com/api/chat.postMessage', {
            headers: {
                'Authorization': 'Bearer ' + config.slack.clink.token,
            },
            json: {
                channel,
                text,
                blocks,
            },
        });
    }

    public sendInvite(token: string, email: string): request.RequestPromise {
        return request.post({
            url: 'https://ye-olde-chums.slack.com/api/users.admin.invite',
            resolveWithFullResponse: true,
            form: {
                token,
                email,
                resend: true,
            },
        });
    }

    public getAllUsers() {
        return request.get('https://slack.com/api/users.list', {
            headers: {
                'Authorization': 'Bearer ' + config.slack.clink.token,
            },
        }).then((res) => JSON.parse(res));
    }

    public getUser(user: string) {
        return request.get('https://slack.com/api/users.info', {
            headers: {
                'Authorization': 'Bearer ' + config.slack.clink.token,
            },
            form: {
                user,
            },
        }).then((res) => JSON.parse(res));
    }
}
