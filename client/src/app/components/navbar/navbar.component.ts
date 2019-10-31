import { Component, ViewEncapsulation } from '@angular/core';

import { Auth } from '../../services/auth.service';

interface INavRoute {
    name: string;
    path: string;
    icon: string;
    auth?: boolean;
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class AppNavbarComponent {
    public routes: INavRoute[] = [
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
            name: 'Quotes',
            path: '/quotes',
            icon: 'format_quote',
        },
        {
            name: 'GIFs',
            path: '/gifs',
            icon: 'image',
        },
        {
            name: 'Stardew',
            path: '/stardew',
            icon: 'nature',
        },
    ];
    public afterRoutes: INavRoute[] = [
        {
            name: 'Settings',
            path: '/settings',
            icon: 'settings',
            auth: true,
        },
    ];

    constructor(public auth: Auth) {}

    public getName() {
        return this.auth.name;
    }
}
