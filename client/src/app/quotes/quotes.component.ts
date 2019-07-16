import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

interface IQuote {
    id: string;
    quote: string;
    quoted_by: string;
    said_by: string;
    timestamp: number;
}

@Component({
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.sass']
})
export class QuotesComponent implements OnInit {

  public quotes: Observable<IQuote[]>;

  public columnsToDisplay = ['saidBy', 'quote', 'quotedBy'];

  constructor(private $http: HttpClient) { }

  public ngOnInit() {
    this.quotes = this.$http.get<IQuote[]>('/api/quotes', {
      params: {
        teamId: environment.slackTeamId,
      },
    });
  }

}
