import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

export interface IGif {
  id: string;
  file: string;
  tags: string[];
  updated: string;
  url: string;
}

@Component({
  selector: 'app-gif',
  templateUrl: './gif.component.html',
  styleUrls: ['./gif.component.sass']
})
export class GifComponent {

  @Input()
  public gif: IGif;

  @Input()
  public allTags: string[] = [];

  public visible = true;
  public selectable = false;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagCtrl = new FormControl();
  public filteredTags: Observable<string[]>;
  public tags: string[] = [];

  @ViewChild('tagInput'/*, {static: false}*/) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto'/*, {static: false}*/) matAutocomplete: MatAutocomplete;

  constructor(private $http: HttpClient) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => this._filter(tag)));
  }

  public ngOnInit() {
    this.tags = this.gif.tags;
  }

  public add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      const trimmed = (value || '').trim();
      if (trimmed && !this.tags.some((tag) => tag === trimmed)) {
        this.tags.push(trimmed);
        this.saveTags();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  public remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.saveTags();
      this.tagCtrl.setValue(null);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags.some((tag) => tag === event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
      this.saveTags();
    }

    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private saveTags() {
    this.$http.post('/api/gifs/update-tags', {
      teamId: environment.slackTeamId,
      gif: this.gif.id,
      tags: this.tags,
    })
    .subscribe();
  }

  private _filter(value: string | null): string[] {
    const filteredTags = this.allTags.filter((tag) => {
      return !this.tags.some((t) => t === tag);
    });

    if (!value)
      return filteredTags;

    const filterValue = value.toLowerCase();

    return filteredTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

}
