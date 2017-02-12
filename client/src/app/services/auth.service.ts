import { Injectable } from '@angular/core';

@Injectable()
export class Auth {
    private lock = new Auth0Lock('', '', {});

    constructor() {
        this.lock.on('authenticated', (authResult: any) => {
            localStorage.setItem('id_token', authResult.idToken);
        });
    }
}
