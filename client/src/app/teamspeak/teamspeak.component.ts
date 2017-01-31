import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-teamspeak',
  templateUrl: './teamspeak.component.html',
  styleUrls: ['./teamspeak.component.sass']
})
export class TeamSpeakComponent implements OnInit {
  private URI = 'ts3server://ts.adam-keenan.com';
  private channels = [
    {
      name: 'General',
      cid: '1',
      clients: [
        {
          name: 'Adam Keenan',
          nickname: 'Keener',
          status: 'online',
        },
        {
          name: 'Josh Felker',
          status: 'away',
        },
      ],
    },
    {
      name: 'Other',
      cid: '2',
      clients: [
        {
          name: 'Alex Sjoberg',
          nickname: 'CapnKrusty',
          status: 'online',
        },
      ]
    },
    {
      name: 'YOCket League',
      cid: '15',
      clients: [],
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit() {
  }

  private getURI(cid?: string) {
    let uri = this.URI;
    if (cid) {
      uri += `?cid=${cid}`;
    }
    return this.sanitizer.bypassSecurityTrustUrl(uri);
  }

}
