interface IFirebaseConfig {
    projectId: string;
    databaseURL: string;
    storageBucket: string;
    locationId: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
    appId: string;
}
// dir relative to root
const config: {
    teamspeak: {
        url: string;
        username: string;
        password: string;
    };
    civ6: {
        usernameMappings: { [playerName: string]: string; };
    };
    slack: {
        clink: {
            client_id: string;
            client_secret: string;
            secret: string;
            token: string;
            teamId: string;
            qotd: {
                channel: string;
                enabled: boolean;
            };
        };
    };
    auth0: {
        client_id: string;
        client_secret: string;
    };
    birthdayChannel: string;
    firebase: {
        quotes: IFirebaseConfig;
        gifs: IFirebaseConfig;
    };
} = require('configamajig')('./src/config');
export default config;
