import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/storage';

import { environment } from 'environments/environment';
import { IGif } from 'app/components/gif/gif.component';

@Component({
  selector: 'app-gifs',
  templateUrl: './gifs.component.html',
  styleUrls: ['./gifs.component.sass']
})
export class GifsComponent implements OnInit {

  public gifs: IGif[] = [];
  public filteredGifs: Observable<IGif[]>;

  public allTags: string[] = [];

  public searchCtrl = new FormControl();

  constructor(private $http: HttpClient, private snackBar: MatSnackBar) {}

  public ngOnInit() {
    this.filteredGifs = this.searchCtrl.valueChanges.pipe(
      startWith(null),
      map((search) => this._filter(search))
    );
    this.loadGifs();
  }

  public upload(file: File) {
    if (!file)
      return;
    console.log(file);
    console.log(file.type);
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('teamId', environment.slackTeamId);
    const req = new HttpRequest('POST', '/api/gifs', formData, { reportProgress: true });
    const progress = new Subject<number>();
    this.$http.request(req).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        const percent = Math.round(100 * event.loaded / event.total);
        progress.next(percent);
      } else if (event instanceof HttpResponse) {
        progress.complete();
      }
    }, (e) => {
      this.snackBar.open('Failed to upload GIF :(', 'Dismiss');
      console.error(e);
    });
    progress.subscribe(() => {}, () => {}, () => {
      this.snackBar.open('GIF successfully uploaded!', 'Dismiss', { duration: 2000 });
      this.loadGifs();
    });
  }

  private loadGifs() {
    this.$http.get<IGif[]>('/api/gifs', {
      params: {
        teamId: environment.slackTeamId,
      },
    }).pipe(map((gifs) => {
      return gifs.sort((a, b) => {
        const aDate = new Date(a.updated);
        const bDate = new Date(b.updated);
        return bDate.valueOf() - aDate.valueOf();
      });
    })).subscribe((gifs) => {
      this.gifs = gifs;
      // To trigger filter
      this.searchCtrl.setValue(this.searchCtrl.value);
      // this.gifs = gifs.concat(gifs).concat(gifs).concat(gifs).concat(gifs).concat(gifs);
      this.allTags = gifs.map((gif) => gif.tags).reduce((allTags, tags) => {
        tags.forEach((tag) => {
          if (allTags.some((t) => t === tag))
            return;
          allTags.push(tag);
        });
        return allTags;
      }, [])
    });
  }

  private _filter(value: string | null) {
    if (!value)
      return this.gifs.slice();

    return this.gifs.filter((gif) => {
      return gif.tags.join(' ').includes(value.toLowerCase());
    });
  }

}
