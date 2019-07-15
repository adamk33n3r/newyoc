// dir relative to root
const config: {
    teamspeak: {
        url: string;
        username: string;
        password: string;
    };
    coinhive: {
        secret: string;
    };
    slack: {
        token: string;
        webhook: string;
        clink: {
            webhook: string;
            secret: string;
            token: string;
        };
    };
    auth0: {
        client_id: string;
        client_secret: string;
    };
    birthdayChannel: string;
} = require('configamajig')('./src/config');
export default config;
