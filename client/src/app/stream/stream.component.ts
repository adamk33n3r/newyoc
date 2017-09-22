import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';

import { Socket, ChatMessage } from '../services/socket.service';
import { Auth } from '../services/auth.service';

import jwplayerSettings from './jwplayer.settings';

import { Chat, Stream } from '../../../../shared/constants/sockets';
import { PlaylistItem } from '../components/jwplayer/jwplayer.types';


declare var Notification: any;

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.sass'],
})
export class StreamComponent implements OnInit {
    public viewerCount = 0;
    public text: string;
    public currentPlaylist: string;
    public settings = jwplayerSettings;

    // TODO: make a localstorage service (or look for one online?)
    public get messages(): ChatMessage[] {
        const allMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        return allMessages[this.currentPlaylist] || [];
    }
    public set messages(val: ChatMessage[]) {
        const allMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        allMessages[this.currentPlaylist] = val;
        localStorage.setItem('chatMessages', JSON.stringify(allMessages));
    }

    private intervalID = 0;
    private unreadMessages = 0;
    private user: string;

    private hiddenAttr: string;
    private visChangeEvent: string;
    private title = window.document.title;

    @ViewChild('iframe')
    private iframe: ElementRef;

    constructor(
        private socket: Socket,
        private auth: Auth,
    ) {}

    public ngOnInit() {
        this.filterOutOldMessages();
        this.setupUser();
        this.auth.userInfo.subscribe((user) => {
            this.setupUser();
        });
        this.socket.on(Stream.ViewerCount, (count) => {
            this.viewerCount = count;
        });

        // Ask for notification permissions
        if (Notification.permission !== 'denied' || Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // Figure out which variable and event to use
        // for knowing if the user is tabbed in or not
        if (window.document.hidden !== undefined) {
            this.hiddenAttr = 'hidden';
            this.visChangeEvent = 'visibilitychange';
        } else if ((<any>window.document).msHidden !== undefined) {
            this.hiddenAttr = 'msHidden';
            this.visChangeEvent = 'msvisibilitychange';
        } else if ((<any>window.document).webkitHidden !== undefined) {
            this.hiddenAttr = 'webkitHidden';
            this.visChangeEvent = 'webkitvisibilitychange';
        }

        // Clear unread messages and remove from title if tab is switched to
        window.document.addEventListener(this.visChangeEvent, () => {
            if (!this.isTabbedAway()) {
                this.unreadMessages = 0;
                window.clearInterval(this.intervalID);
                this.intervalID = 0;
                this.updateTitle();
            }
        });
    }

    public onPlayerReady() {
        console.log('onPlayerReady');
        this.socket.on(Chat.Connect, (user) => {
            console.log('chat connect', user);
            this.addMessage({
                user: 'YOC',
                text: `${user} connected!`,
                playlist: this.currentPlaylist,
                timestamp: Date.now(),
            });
        });
        this.socket.on(Chat.Disconnect, (user) => {
            this.addMessage({
                user: 'YOC',
                text: `${user} disconnected!`,
                playlist: this.currentPlaylist,
                timestamp: Date.now(),
            });
        });
        console.log(Chat.Message);
        this.socket.on(Chat.Message, (message) => {
            console.log('chat message', message);
            if (message.playlist !== this.currentPlaylist) {
                return;
            }
            const links = message.text.match(/https?:\/\/\S+/ig) || [];
            for (const link of links) {
                message.text = message.text.replace(link, `<a target="_blank" href="${link}">${link}</a>`);
            }
            this.addMessage(message);

            // If tab is hidden
            if (this.isTabbedAway()) {
                // Update title
                this.unreadMessages++;

                let first = true;
                if (this.intervalID !== 0) {
                    window.clearInterval(this.intervalID);
                }
                this.intervalID = window.setInterval(() => {
                    if (first) {
                        this.updateTitle();
                    } else {
                        window.document.title = `${message.user} sent a message!`;
                    }
                    first = !first;
                }, 1000);

                // Create notification
                const notification = new Notification(`New message from ${message.user}`, {
                    body: message.text,
                    icon: '/assets/images/yoc.png',
                    tag: Chat.Message,
                });
                notification.onclick = (event: Event) => {
                    notification.close();
                    window.focus();
                };
                window.setTimeout(notification.close.bind(notification), 3000);
            }
        });
    }

    public onPlaylistItem(event: PlaylistItem) {
        this.currentPlaylist = event.item.title;
        if (!this.messages) {
            this.messages = [];
        } else {
            this.filterOutOldMessages();
        }
    }

    public sendChat($event: KeyboardEvent) {
        if ($event.keyCode !== 13 || this.text === '') {
            return;
        }
        this.socket.emit('chat:message', {
            user: this.user,
            text: this.text,
            playlist: this.currentPlaylist,
            timestamp: Date.now(),
        });

        this.text = '';
        $event.preventDefault();
    }

    /**
     * If the tab is hidden
     */
    private isTabbedAway(): boolean {
        return (<any>window.document)[this.hiddenAttr];
    }

    private updateTitle() {
        // If there are unread messages, show them in the title. Else reset it
        if (this.unreadMessages > 0) {
            window.document.title = `(${this.unreadMessages}) ${this.title}`;
        } else {
            window.document.title = this.title;
        }
    }

    private addMessage(message: ChatMessage) {
        const messages = this.messages;
        messages.unshift(message);
        this.messages = messages;
    }

    private generateGuestName() {
        const guestNumber = Math.floor(Math.random() * 10000);
        this.user = `Guest#${guestNumber}`;
    }

    private setupUser() {
        if (this.auth.isAuthenticated()) {
            this.user = this.auth.name;
            this.socket.emit(Chat.Connect, this.user);
        } else {
            this.generateGuestName();
        }
    }

    private filterOutOldMessages() {
        const now = Date.now();
        const withinPastDay = this.messages.filter((message) => {
            const dayInMilliseconds = (24 * 60 * 60 * 1000);
            const diff = now - message.timestamp;
            return diff < dayInMilliseconds;
        });
        this.messages = withinPastDay;
    }
}
