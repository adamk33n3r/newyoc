import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.sass' ],
})
export class MainComponent {
    public email: string;

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

    constructor(private http: HttpClient, private snack: MatSnackBar) {}

    public sendInvite(email: string) {
        if (!email) {
            return;
        }
        this.http.post('/api/services/slack/send-invite', { email })
        .subscribe((response: any) => {
            if (response.success) {
                this.snack.open(`Invite sent to ${email}!`, 'Dismiss', {
                    duration: 5000,
                });
            }  else {
                this.snack.open(`${email} already invited!`, 'Dismiss');
            }
        });
    }
}
