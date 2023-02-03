import * as request from 'request-promise-native';
import config from 'src/config';

interface ISlackUser {
    id: string;
    team_id: string;
    name: string;
    deleted: boolean;
    color: string;
    real_name: string;
    tz: string;
    tz_label: string;
    tz_offset: number;
    profile: ISlackUserProfile;
    is_admin: boolean;
    is_owner: boolean;
    is_primary_owner: boolean;
    is_restricted: boolean;
    is_ultra_restricted: boolean;
    is_bot: boolean;
    is_app_user: boolean;
    updated: number;
    has_2fa: boolean;
}

interface ISlackUserProfile {
    title: string;
    phone: string;
    skype: string;
    real_name: string;
    real_name_normalized: string;
    display_name: string;
    display_name_normalized: string;
    status_text: string;
    status_emoji: string;
    status_expiration: number;
    avatar_hash: string;
    image_original: string;
    is_custom_image: boolean;
    first_name: string;
    last_name: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    image_1024: string;
    status_text_canonical: string;
    team: string;
}

interface ISlackResponse {
    ok: boolean;
    body: string;
}

interface ISlackUserResponse extends ISlackResponse {
    members: ISlackUser[];
    cache_ts: number;
    response_metadata: {
        next_cursor: string;
    };
}

type SlackRequestResponse = request.RequestPromise<ISlackResponse>;

export class Clink {
    public sendMessage(channel: string, text: string, blocks?: any[]): SlackRequestResponse {
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

    public sendInvite(email: string): SlackRequestResponse {
        return request.post({
            url: 'https://ye-olde-chums.slack.com/api/users.admin.invite',
            resolveWithFullResponse: true,
            form: {
                token: config.slack.clink.token,
                email,
                resend: true,
            },
        });
    }

    public getAllUsers(): Promise<ISlackUserResponse> {
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
