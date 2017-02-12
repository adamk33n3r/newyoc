import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-teamspeak',
    templateUrl: './teamspeak.component.html',
    styleUrls: ['./teamspeak.component.sass']
})
export class TeamSpeakComponent implements OnInit {
    public channels: any[] = [];
    private URI = 'ts3server://ts.adam-keenan.com';

    constructor(private sanitizer: DomSanitizer, private http: Http) {
        this.refresh();
    }

    public ngOnInit() {
    }

    public refresh() {
        this.http.get('/api/services/teamspeak')
        .subscribe((response) => {
            const data = response.json().data;
            this.channels = this.buildData([], data.channels, data.online);
            console.log(this.channels);
        });
    }

    public getURI(cid?: string) {
        let uri = this.URI;
        if (cid) {
            uri += `?cid=${cid}`;
        }
        return this.sanitizer.bypassSecurityTrustUrl(uri);
    }

    private buildData(users: any[], channels: any[], online: any[]) {
        const rebuiltClients = online.map((client) => {
            return {
                name: client.client_nickname,
                realname: client.client_nickname,
                away: client.client_away,
                cid: client.cid,
            };
        });
        this.sortClients(rebuiltClients);
        console.log(rebuiltClients);
        // Attach to channels
        for (const channel of channels) {
            channel.clients = [];
            for (const client of rebuiltClients) {
                if (client.cid !== channel.cid) {
                    continue;
                }
                for (const user of users) {
                    const index = user.usernames.teamspeak.indexOf(client.name);
                    if (index >= 0) {
                        client.realname = user.name;
                        break;
                    }
                }
                console.log(client);
                channel.clients.push(client);
            }
        }
        return channels;
    }

    private sortClients(clients: any[]) {
        // Sort alphabetically
        clients.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        // Sort by status
        clients.sort((a, b) => {
            if ((a.online && b.away) || (a.online && !b.online) || (a.away && !b.online)) {
                return -1;
            }
            if ((b.online && a.away) || (b.online && !a.online) || (b.away && !a.online)) {
                return 1;
            }
            return 0;
        });
    }
}
