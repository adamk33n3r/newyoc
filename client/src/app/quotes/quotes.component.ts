import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatSort } from '@angular/material';

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

  public quotes: MatTableDataSource<IQuote> = new MatTableDataSource();

  public columnsToDisplay = ['said_by_name', 'quote', 'quoted_by_name'];

  @ViewChild(MatSort/*, {static: true}*/) sort: MatSort;

  constructor(private $http: HttpClient) { }

  public ngOnInit() {
    this.$http.get<IQuote[]>('/api/quotes', {
      params: {
        teamId: environment.slackTeamId,
      },
    }).subscribe((data) => {
      this.quotes.data = data;
    });
    this.quotes.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.quotes.filter = filterValue.trim().toLowerCase();
  }

}
