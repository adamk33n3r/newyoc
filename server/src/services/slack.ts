import * as request from 'request-promise-native';
import config from 'src/config';

export class Slack {
    public sendMessage(url: string, payload: any): request.RequestPromise {
        if (typeof payload === 'string') {
            payload = { text: payload };
        }

        payload.link_names = true;

        return request.post({
            url,
            resolveWithFullResponse: true,
            form: {
                payload: JSON.stringify(payload).replace(/\\\\/g, '\\'),
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
            json: true,
        }).then((res) => JSON.parse(res));
    }
}
