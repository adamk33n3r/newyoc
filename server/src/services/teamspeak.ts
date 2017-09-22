import {
    TeamSpeakClient,
    CallbackData,
    GenericResponseData,
} from 'node-ts';

type ErrorFunction = (error: any) => void;
type ReturnPromise = Promise<CallbackData<GenericResponseData>>;
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

    public login(username: string, password: string): ReturnPromise {
        return this.client.send('login', {
            client_login_name: username,
            client_login_password: password,
        }).then(() => {
            return this.client.send('use', { sid: 1 });
        });
    }

    public getClients(): Promise<any[]> {
        return this.client.send('clientdblist', {}, [])
            .then(this.handleResponse)
            .then(this.stripQueryClients);
    }

    public getOnlineClients(): Promise<any[]> {
        return this.client.send('clientlist', {}, ['away'])
            .then(this.handleResponse)
            .then(this.stripQueryClients);
    }

    public getChannel(id: number): ReturnPromise {
        return this.client.send('channelinfo', { cid: id })
            .then(this.handleResponse);
    }

    public getChannels() {
        return this.client.send('channellist', {}, [])
            .then(this.handleResponse);
    }

    public close(): ReturnPromise {
        return this.client.send('logout');
    }

    private handleResponse(response: any) {
        return response.response;
    }

    private stripQueryClients(clients: any[]) {
        return clients.filter((client) => {
            return !client.client_type && client.client_unique_identifier !== 'ServerQuery';
        });
    }
}
