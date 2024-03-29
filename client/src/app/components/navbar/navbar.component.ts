import { Component, ViewEncapsulation } from '@angular/core';

import { Auth } from '../../services/auth.service';

interface INavRoute {
    name: string;
    path: string;
    icon: string;
    auth?: boolean;
    isExternal?: boolean;
    outlined?: boolean;
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
            name: 'Slack',
            path: 'https://join.slack.com/t/ye-olde-chums/shared_invite/zt-1odnjgh0l-YahIHUl~OSCfxlP0cCa2Tg',
            icon: 'chat',
            isExternal: true,
            outlined: true,
        },
        {
            name: 'Discord',
            path: 'https://discord.gg/mKVD9Wa',
            icon: 'mic',
            isExternal: true,
        },
        // {
        //     name: 'Stream',
        //     path: '/stream',
        //     icon: 'ondemand_video',
        // },
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
