import {
  Directive,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';

@Directive({
  selector: 'jwplayer',
})
export class JWPlayerComponent implements OnInit {
  @Input()
  private settings: any;

  @Output()
  private playlistItem = new EventEmitter();

  @Output()
  private error = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  public ngOnInit() {
    const player = jwplayer(this.elementRef.nativeElement).setup(this.settings);
    player.onPlaylistItem(() => {
      this.playlistItem.emit();
    });
    player.onError((e: Error) => {
      this.error.emit(e);
    });
  }

}
