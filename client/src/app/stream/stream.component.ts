import { Component, OnInit, Inject } from '@angular/core';

import { WindowProvider } from '../window.provider';

import jwplayerSettings from './jwplayer.settings';

declare var Notification: any;

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.sass']
})
export class StreamComponent implements OnInit {
  // TODO: move to chat component
  private text: string;
  private intervalID = 0
  private unreadMessages = 0
  private currentPlaylist: string;
  private settings = jwplayerSettings;
  private messages = [
    {
      user: 'Adam',
      text: 'I am a chat',
      timestamp: 'now',
    },
    {
      user: 'Adam',
      text: 'I am a chat too',
      timestamp: 'then',
    },
  ];
  private hiddenAttr: string;
  private visChangeEvent: string;
  private title = this.window.document.title;

  constructor(@Inject(WindowProvider) private window: Window) {
    // Ask for notification permissions
    if (Notification.permission !== 'denied' || Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Figure out which variable and event to use
    // for knowing if the user is tabbed in or not
    if (window.document.hidden) {
      this.hiddenAttr = 'hidden';
      this.visChangeEvent = 'visibilitychange';
    } else if ((<any> this.window.document).msHidden) {
      this.hiddenAttr = 'msHidden';
      this.visChangeEvent = 'msvisibilitychange';
    } else if ((<any> this.window.document).webkitHidden) {
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
  }

  public ngOnInit() {
  }

  private sendChat($event: KeyboardEvent) {
    if ($event.keyCode !== 13 || this.text === '') {
      return;
    }
    console.log(`sending message: ${this.text}`);
    // emit socket chat:msg
    /*
    $scope.socket.emit 'chat:msg',
      user: user
      text: $scope.text
      playlist: currentPlaylist
      timestamp: Date.now()
    */
    this.messages.unshift({
      user: 'Me',
      timestamp: 'sometime',
      text: this.text,
    });

    this.text = '';
    $event.preventDefault();
  }

  /**
   * If the tab is hidden
   */
  private isTabbedAway(): boolean {
    return this.window.document[this.hiddenAttr];
  }

  private updateTitle() {
    // If there are unread messages, show them in the title. Else reset it
    if (this.unreadMessages > 0) {
      this.window.document.title = "(#{unreadMessages}) #{title}"
    } else {
      this.window.document.title = this.title;
    }
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

  $scope.socket.on 'chat:msg', (message) ->
    console.log message
    return if message.playlist isnt currentPlaylist
    links = message.text.match /https?:\/\/\S+/ig
    for link in links or []
      message.text = message.text.replace link, "<a target=\"_blank\" href=\"#{link}\">#{link}</a>"
    $scope.getMessages().unshift message

    # If tab is hidden
    if isTabbedAway()
      # Update title
      unreadMessages++

      first = true
      clearInterval intervalID if intervalID isnt 0
      intervalID = setInterval () ->
        if first
          updateTitle()
        else
          $window.document.title = "#{message.user} sent a message!"
        first = not first
      , 1000

      # Create notification
      notification = new Notification "New message from #{message.user}",
        body: message.text
        icon: '/assets/images/yoc.png'
        tag: 'chat:message'
      notification.onclick = (ev) ->
        notification.close()
        window.focus()
      setTimeout notification.close.bind(notification), 3000

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
