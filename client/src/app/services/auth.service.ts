import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/Rx';

//import { JwtHelperService } from '@auth0/angular-jwt';
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

export class User {
    public get name(): string {
        return this.userProfile.user_metadata.name;
    }
    public get nickname(): string {
        return this.userProfile.nickname;
    }
    public get picture(): string {
        return this.userProfile.picture;
    }

    public constructor(public userProfile: Auth0User) {}
}

export interface Auth0User extends auth0.Auth0UserProfile {
    // This "name" is their username. Likely their email address. User the metadata name.
    name: string;
    nickname: string;
    email?: string;
    user_metadata?: {
        birthday: string;
        given_name: string;
        family_name: string;
        name: string;
    };
    app_metadata?: {
        ip: string;
        roles: string[];
    };
    ip?: string;
    roles?: string[];
}

@Injectable()
export class Auth {
    public readonly authorized = new ReplaySubject<any>();
    public readonly userInfo = new ReplaySubject<User>();
    public get user() { return this.profile; }
    public get name() {
        return this.user ? (this.user.user_metadata.name || this.user.nickname) : '';
    }

    private lock: any;
    private profile: any;
    private accessToken: string;

  constructor(private http: HttpClient, private router: Router/*, private jwtHelper: JwtHelperService*/) {
        return;
        this.lock = new Auth0Lock(
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
                        name: 'first_name',
                        placeholder: 'First name',
                    },
                    {
                        name: 'last_name',
                        placeholder: 'Last name',
                    },
                    {
                        name: 'birthday',
                        placeholder: 'Enter your birthday: 12/31',
                        validator: (birthday) => {
                            return {
                                valid: !!birthday.match(/\d{2}\/\d{2}/),
                                hint: 'Format is dd/mm',
                            };
                        },
                    },
                    {
                        name: 'slack',
                        placeholder: 'Slack @username',
                        validator: (username) => {
                            return {
                                valid: !!username.match(/^@/),
                                hint: 'Include the @',
                            }
                        }
                    }
                ],
            },
        );

        if (!this.isAuthenticated()) {
            localStorage.removeItem('profile');
        }
        this.profile = this.getUserInfo();
        if (this.profile) {
            this.userInfo.next(this.profile);
        }
        this.lock.on('authenticated', (authResult: AuthResult) => {
            const path = sessionStorage.getItem(authResult.state);
            window.setTimeout(() => {
                this.router.navigateByUrl(path);
            });
            this.authorized.next(null);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('accessToken', authResult.accessToken);
            this.accessToken = authResult.accessToken;
            this.lock.getUserInfo(authResult.accessToken, (error: any, profile: any) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.userInfo.next(new User(profile));
                this.profile = profile;
                localStorage.setItem('profile', JSON.stringify(profile));
            });
        });
        this.lock.on('authorization_error', (error: any) => {
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
        return false;
        //return !this.jwtHelper.isTokenExpired();
    }

    public logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profile');
        this.profile = null;
        this.userInfo.next(this.profile);
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
