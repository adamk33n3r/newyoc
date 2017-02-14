import {
    Component,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
} from '@angular/core';

import { PlaylistItem } from './jwplayer.types';

@Component({
    selector: 'jwplayer',
    template: `
        <div #player></div>
    `,
})
export class JWPlayerComponent implements AfterViewInit, OnDestroy {
    @Input()
    private settings: any;

    @Output()
    private ready = new EventEmitter();

    @Output()
    private playlistItem = new EventEmitter<PlaylistItem>();

    @Output()
    private error = new EventEmitter();

    @ViewChild('player')
    private playerRef: ElementRef;

    private player: JWPlayer;
    public get Player(): JWPlayer {
        return this.player;
    }

    constructor(private elementRef: ElementRef) {}

    public ngAfterViewInit() {
        this.player = jwplayer(this.playerRef.nativeElement).setup(this.settings);
        this.player.onReady(() => {
            this.ready.emit();
        });
        this.player.onPlaylistItem((thing) => {
            this.playlistItem.emit(thing);
        });
        this.player.onError((e: Error) => {
            this.error.emit(e);
        });
    }

    public ngOnDestroy() {
        this.player.remove();
    }
}
