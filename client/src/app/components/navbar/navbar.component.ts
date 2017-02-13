import { Component, ViewEncapsulation } from '@angular/core';

import { Auth } from '../../services/auth.service';

interface INavRoute {
    name: string;
    path: string;
    icon: string;
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class AppNavbarComponent {
    private routes: INavRoute[] = [
        {
            name: 'TeamSpeak',
            path: '/teamspeak',
            icon: 'keyboard_voice',
        },
        {
            name: 'Stream',
            path: '/stream',
            icon: 'ondemand_video',
        },
        {
            name: 'Stardew',
            path: '/stardew',
            icon: 'nature',
        },
    ];
    private afterRoutes: INavRoute[] = [
        {
            name: 'Settings',
            path: '/settings',
            icon: 'settings',
        },
    ];
    constructor(public auth: Auth) {
        console.log(auth);
    }
}
