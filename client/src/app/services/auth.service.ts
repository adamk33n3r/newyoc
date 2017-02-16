import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { tokenNotExpired } from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

declare module '@angular/core' {
    export class EventEmitter<T> {
        public emit(value?: T): void;
        public subscribe(generatorOrNext?: (data?: T) => void, error?: any, complete?: any): any;
    }
}

interface AuthResult {
    state: string;
    idToken: string;
    accessToken: string;
}

@Injectable()
export class Auth {
    public readonly authorized = new EventEmitter<any>();
    public readonly userInfo = new EventEmitter<{ name: string }>();
    public get user() { return this.profile; }

    private lock = new Auth0Lock(
        'KrdM9NH9w7S47zY0Fxygg5h8ij1JzeK7',
        'adamk33n3r.auth0.com',
        {
            auth: {
                redirectUrl: location.origin,
                responseType: 'token',
            },
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

    constructor(private http: Http, private router: Router) {
        this.profile = this.getUserInfo();
        if (this.profile) {
            this.userInfo.emit(this.profile);
        }
        this.lock.on('authenticated', (authResult: AuthResult) => {
            const path = sessionStorage.getItem(authResult.state);
            window.setTimeout(() => {
                this.router.navigateByUrl(path);
            });
            this.authorized.emit();
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('accessToken', authResult.accessToken);
            this.accessToken = authResult.accessToken;
            this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.userInfo.emit(profile);
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
        const uuid = this.genUUID();
        sessionStorage.setItem(uuid, this.router.url);
        this.lock.show({
            auth: {
                params: {
                    scope: 'openid name email',
                    state: uuid,
                },
            },
        });
    }

    public isAuthenticated() {
        return tokenNotExpired();
    }

    public logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profile');
        this.profile = null;
        this.userInfo.emit(this.profile);
    }

    private getUserInfo() {
        return JSON.parse(localStorage.getItem('profile'));
    }

    private genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
