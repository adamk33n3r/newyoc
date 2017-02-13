import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MdSnackBar } from '@angular/material';

@Component({
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.sass' ],
})
export class MainComponent {
    public images = [
        {
            src: 'yoc-profile.png',
            title: 'White Background',
        },
        {
            src: 'yoc.png',
            title: 'Transparent Background',
        },
        {
            src: 'yoc-transparent.png',
            title: 'Transparent Background/Center',
        },
    ];

    constructor(private http: Http, private snack: MdSnackBar) {}

    public sendInvite(email: string) {
        if (!email) {
            return;
        }
        this.http.post('/api/services/slack/send-invite', { email })
        .subscribe((response) => {
            const json = response.json();
            if (json.success) {
                this.snack.open(`Invite sent to ${email}!`, 'Dismiss', {
                    duration: 5000,
                });
            }  else {
                this.snack.open(`${email} already invited!`, 'Dismiss');
            }
        });
    }
}
