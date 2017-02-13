import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { Auth } from './auth.service';

@Injectable()
export class AuthGuard {
    constructor(private auth: Auth, private router: Router) {}

    public canActivate() {
        if (this.auth.isAuthenticated()) {
            return true;
        } else {
            this.router.navigateByUrl('/');
            return false;
        }
    }
}
