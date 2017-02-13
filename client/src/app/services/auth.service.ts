import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

import Auth0Lock from 'auth0-lock';
@Injectable()
export class Auth {
    private lock = new Auth0Lock(
        'KrdM9NH9w7S47zY0Fxygg5h8ij1JzeK7',
        'adamk33n3r.auth0.com',
        {
            theme: {
                logo: '/assets/images/yoc.png',
                primaryColor: '#ff5252',
            },
            languageDictionary: {
                title: 'Ye Olde Chums',
            },
            additionalSignUpFields: [
                {
                    name: 'birthday',
                    placeholder: 'Enter your birthday: 12/31/1999',
                    validator: (birthday) => {
                        return {
                            valid: !!birthday.match(/\d{1,2}\/\d{1,2}\/\d{4}/),
                            hint: 'Format is dd/mm/yyyy',
                        };
                    },
                },
            ],
        },
    );

    private profile: any;
    private accessToken: string;

    constructor(private http: Http) {
        this.lock.on('authenticated', (authResult: any) => {
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('accessToken', authResult.accessToken);
            this.accessToken = authResult.accessToken;
            this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.profile = profile;
                localStorage.setItem('profile', JSON.stringify(profile));
            });
        });
        this.lock.on('authorization_error', (error) => {
            console.error(error);
        });
        this.accessToken = localStorage.getItem('accessToken');
    }

    public login() {
        this.lock.show();
    }

    public isAuthenticated() {
        return tokenNotExpired();
    }

    public logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profile');
    }

    public getUserInfo() {
        return JSON.parse(localStorage.getItem('profile'));
    }
}
