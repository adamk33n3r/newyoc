import {
    TeamSpeakClient,
    CallbackData,
    GenericResponseData,
} from 'node-ts';

type ErrorFunction = (error: any) => void;
export class TeamSpeak {
    protected client: TeamSpeakClient;

    constructor(url: string, onError?: ErrorFunction) {
        this.client = new TeamSpeakClient(url);
        this.client.on('error', (error: any) => {
            if (onError) {
                onError(error);
            }
        });
    }

    public async login(username: string, password: string) {
        await this.client.send('use', { sid: 1 });
        return await this.client.send('login', {
            client_login_name: username,
            client_login_password: password,
        });
    }

    public async getClients() {
        return this.stripQueryClients(this.handleResponse(await this.client.send('clientdblist', {}, [])));
    }

    public async getOnlineClients() {
        return this.stripQueryClients(this.handleResponse(await this.client.send('clientlist', {}, ['away'])));
    }

    public async getChannel(id: number) {
        return this.handleResponse(await this.client.send('channelinfo', { cid: id }));
    }

    public async getChannels() {
        return this.handleResponse(await this.client.send('channellist', {}, []));
    }

    public async close() {
        return this.handleResponse(await this.client.send('logout'));
    }

    private handleResponse<T>(response: CallbackData<T>) {
        return response.response;
    }

    private stripQueryClients(clients: any[]) {
        return clients.filter((client) => {
            return !client.client_type && client.client_unique_identifier !== 'ServerQuery';
        });
    }
}
