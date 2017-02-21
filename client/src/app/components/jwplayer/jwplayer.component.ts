import {
    Component,
    ViewChild,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
    ElementRef,
} from '@angular/core';

import { PlaylistItem } from './jwplayer.types';

@Component({
    selector: 'jwplayer',
    template: `
        <iframe #iframe
            id='player-iframe'
            name='player-iframe'
            src='./stream.html'
            allowfullscreen="allowfullscreen"
        ></iframe>
    `,
    styles: [`
        iframe {
            border: none;
        }
    `],
})
export class JWPlayerComponent implements AfterViewInit {
    @Input()
    private settings: any;

    @Output()
    private ready = new EventEmitter();

    @Output()
    private playlistItem = new EventEmitter<PlaylistItem>();

    @Output()
    private error = new EventEmitter();

    @ViewChild('iframe')
    private iframe: ElementRef;

    private player: JWPlayer;
    public get Player(): JWPlayer {
        return this.player;
    }

    constructor(private elementRef: ElementRef) {}

    public ngAfterViewInit() {
        const iframe = this.iframe.nativeElement as HTMLIFrameElement;
        iframe.onload = () => {
            // Get window of iframe
            const iframeWin = iframe.contentWindow as any;

            // Get document of iframe
            const subDoc = iframeWin.document as Document;

            // Define init function inside iframe
            iframeWin.init = (config: any) => {
                // Create div for player
                const playerElement = subDoc.createElement('div');
                playerElement.id = 'player';

                // Add player to body
                subDoc.body.appendChild(playerElement);

                function resize() {
                    const playerEle = subDoc.getElementById('player');
                    iframe.width = `${iframe.parentElement.parentElement.clientWidth}px`;
                    iframe.height = `${playerEle.scrollHeight}px`;
                }

                // Setup jwplayer
                const player = iframeWin.jwplayer(playerElement).setup(config);

                // Resize frame when player is ready
                player.onReady(() => {
                    resize();
                });

                // Resize frame when parent window is resized
                window.addEventListener('resize', () => {
                    resize();
                });

                return player;
            };

            // Create script to load jwplayer
            const jwplayerScript = subDoc.createElement('script');
            jwplayerScript.src = 'assets/jwplayer/jwplayer.js';

            jwplayerScript.onload = () => {
                // Set jwplayer key
                iframeWin.jwplayer.key = '5YkESdD6u5l8luORkA5ZUOdzUGDlzokaiidsaw==';

                // Call init function to initialize player once key has been added
                this.player = iframeWin.init(this.settings);

                // Setup events
                this.player.onReady(() => {
                    this.ready.emit();
                });
                this.player.onPlaylistItem((thing) => {
                    this.playlistItem.emit(thing);
                });
                this.player.onError((e: Error) => {
                    this.error.emit(e);
                });
            };

            subDoc.head.appendChild(jwplayerScript);

            // Set style of body
            subDoc.body.style.cssText = 'margin: 0; overflow: hidden;';
        };
    }
}
