import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div class='container'>
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AppContent {
}
