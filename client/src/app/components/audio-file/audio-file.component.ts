import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'av-file',
  templateUrl: './audio-file.component.html',
  styleUrls: ['./audio-file.component.css']
})
export class AudioFileComponent implements OnInit {

  @Output()
  public file = new EventEmitter();

  public selectedFile: File;

  constructor() { }

  public ngOnInit() {
  }

  public onFileChange(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    this.file.emit(this.selectedFile);
    (event.target as HTMLInputElement).value = null;
  }
}
