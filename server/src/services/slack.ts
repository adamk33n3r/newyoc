import * as request from 'request-promise-native';

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
}
