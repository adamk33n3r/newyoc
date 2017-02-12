"use strict";
const node_ts_1 = require("node-ts");
class TeamSpeak {
    constructor(url, onError) {
        this.client = new node_ts_1.TeamSpeakClient(url);
        this.client.on('error', (error) => {
            if (onError) {
                onError(error);
            }
        });
    }
    login(username, password) {
        return this.client.send('login', {
            client_login_name: username,
            client_login_password: password,
        }).then(() => {
            return this.client.send('use', { sid: 1 });
        });
    }
    getClients() {
        return this.client.send('clientdblist', {}, [])
            .then(this.handleResponse)
            .then(this.stripQueryClients);
    }
    getOnlineClients() {
        return this.client.send('clientlist', {}, ['away'])
            .then(this.handleResponse)
            .then(this.stripQueryClients);
    }
    getChannel(id) {
        return this.client.send('channelinfo', { cid: id })
            .then(this.handleResponse);
    }
    getChannels() {
        return this.client.send('channellist', {}, [])
            .then(this.handleResponse);
    }
    close() {
        return this.client.send('logout');
    }
    handleResponse(response) {
        return response.response;
    }
    stripQueryClients(clients) {
        return clients.filter((client) => {
            return !client.client_type && client.client_unique_identifier !== 'ServerQuery';
        });
    }
}
exports.TeamSpeak = TeamSpeak;
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/services/teamspeak.js.map