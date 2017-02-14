import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { WindowProvider } from '../window.provider';

import { Socket, ChatMessage } from '../services/socket.service';

import jwplayerSettings from './jwplayer.settings';

import { Chat, Stream } from 'src/../../../shared/constants/sockets';
import { PlaylistItem } from '../components/jwplayer/jwplayer.types';


declare var Notification: any;

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.sass'],
})
export class StreamComponent implements OnInit {
    // TODO: move to chat component
    public viewerCount = 0;
    public text: string;

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
    private currentPlaylist: string;
    private settings = jwplayerSettings;

    private hiddenAttr: string;
    private visChangeEvent: string;
    private title = this.window.document.title;

    constructor(@Inject(WindowProvider) private window: Window, private socket: Socket) {}

    public ngOnInit() {
    }

    public onPlayerReady() {
        this.socket.on(Stream.ViewerCount, (count) => {
            // console.log('ViewerCount', count);
            this.viewerCount = count;
        });
        this.socket.on(Chat.Connect, (user) => {
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
        this.socket.on(Chat.Message, (message) => {
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
                    this.window.clearInterval(this.intervalID);
                }
                this.intervalID = this.window.setInterval(() => {
                    if (first) {
                        this.updateTitle();
                    } else {
                        this.window.document.title = `${message.user} sent a message!`;
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
                    this.window.focus();
                };
                this.window.setTimeout(notification.close.bind(notification), 3000);
            }
        });

        // Ask for notification permissions
        if (Notification.permission !== 'denied' || Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // Figure out which variable and event to use
        // for knowing if the user is tabbed in or not
        if (this.window.document.hidden !== undefined) {
            this.hiddenAttr = 'hidden';
            this.visChangeEvent = 'visibilitychange';
        } else if ((<any>this.window.document).msHidden !== undefined) {
            this.hiddenAttr = 'msHidden';
            this.visChangeEvent = 'msvisibilitychange';
        } else if ((<any>this.window.document).webkitHidden !== undefined) {
            this.hiddenAttr = 'webkitHidden';
            this.visChangeEvent = 'webkitvisibilitychange';
        }

        // Clear unread messages and remove from title if tab is switched to
        this.window.document.addEventListener(this.visChangeEvent, () => {
            if (!this.isTabbedAway()) {
                this.unreadMessages = 0;
                this.window.clearInterval(this.intervalID);
                this.intervalID = 0;
                this.updateTitle();
            }
        });
        this.socket.emit(Chat.Connect, 'adam');
    }

    public onPlaylistItem(event: PlaylistItem) {
        this.currentPlaylist = event.item.title;
        if (!this.messages) {
            this.messages = [];
        }
        const now = Date.now();
        const withinPastDay = this.messages.filter((message) => {
            return (now - message.timestamp) < (24 * 60 * 60 * 1000);
        });
    }

    private sendChat($event: KeyboardEvent) {
        if ($event.keyCode !== 13 || this.text === '') {
            return;
        }
        this.socket.emit('chat:message', {
            user: 'Adam',
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
        return (<any>this.window.document)[this.hiddenAttr];
    }

    private updateTitle() {
        // If there are unread messages, show them in the title. Else reset it
        if (this.unreadMessages > 0) {
            this.window.document.title = `(${this.unreadMessages}) ${this.title}`;
        } else {
            this.window.document.title = this.title;
        }
    }

    private addMessage(message: ChatMessage) {
        const messages = this.messages;
        messages.unshift(message);
        this.messages = messages;
    }

    /*
      $scope.$storage = $localStorage.$default
        playlist: {}

      # Setup guest name
      guestNumber = Math.floor(Math.random() * 10000)
      user = 'Guest#' + guestNumber

      # Switch to other chat channel when switching playlist
      $scope.$on 'playlist', (e, playlistName) ->
        $scope.$apply () ->
          currentPlaylist = playlistName
          unless $scope.$storage[currentPlaylist]?
            $scope.$storage[currentPlaylist] = []

          # Get rid of messages that are over a day old
          now = Date.now()
          $scope.$storage[currentPlaylist] = $scope.$storage[currentPlaylist].filter (message) ->
            return (now - message.timestamp) < (24 * 60 * 60 * 1000)


      $scope.socket.on 'chat:connect', (user) ->
        console.log user, 'connected'
        $scope.getMessages().unshift
          user: 'YOC'
          text: "#{user} connected"
          timestamp: Date.now()

      $scope.socket.on 'chat:disconnect', (user) ->
        console.log user, 'disconnected'
        if user?
          $scope.getMessages().unshift
            user: 'YOC'
            text: "#{user} disconnected"
            timestamp: Date.now()

      unregister = $scope.$watch 'user', =>
        console.log 'user updated'
        if $scope.user?
          user = $scope.user?.name
          $scope.socket.emit 'chat:connect', user
          unregister()

      $scope.getMessages = () ->
        return $scope.$storage[currentPlaylist]
     */
}
