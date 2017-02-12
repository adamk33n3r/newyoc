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
    private playlistItem = new EventEmitter();

    @Output()
    private error = new EventEmitter();

    @ViewChild('player')
    private playerRef: ElementRef;

    private player: JWPlayer;

    constructor(private elementRef: ElementRef) {}

    public ngAfterViewInit() {
        this.player = jwplayer(this.playerRef.nativeElement).setup(this.settings);
        this.player.onPlaylistItem(() => {
            this.playlistItem.emit();
        });
        this.player.onError((e: Error) => {
            this.error.emit(e);
        });
    }

    public ngOnDestroy() {
        this.player.remove();
    }
}
