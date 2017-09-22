import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var CoinHive: any;

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.sass']
})
export class MinerComponent implements OnInit {
  public totalHashes: number = 0;
  public hashesPerSecond: number = 0;
  public autoStart: boolean = false;
  public user: string = null;
  public threads: number = navigator.hardwareConcurrency / 2;

  public siteInfo: {
      xmr?: number;
      rate?: number;
      totalHashes?: number;
      hashesPerSecond?: number;
  } = {};

  private miner: any;

  constructor(private http: HttpClient) {
    this.user = localStorage.getItem('yoc:miner:user') || null;
    if (typeof CoinHive !== 'undefined') {
      this.createMiner();
      if (this.autoStart) {
        this.start();
      }
    }
  }

  public ngOnInit() {
      this.http.get('/api/services/miner/payout')
      .subscribe((data: any) => {
          this.siteInfo.rate = data.xmrToUsd;
      });
      this.http.get('/api/services/miner/site')
      .subscribe((data: any) => {
          this.siteInfo.xmr = data.xmrPaid + data.xmrPending;
          this.siteInfo.hashesPerSecond = data.hashesPerSecond;
          this.siteInfo.totalHashes = data.hashesTotal;
      });
      setInterval(() => {
        if (!this.miner) { return; }
        this.totalHashes = this.miner.getTotalHashes(true);
        this.hashesPerSecond = this.miner.getHashesPerSecond();
      }, 1000);
  }

  public start() {
    this.miner.setNumThreads(this.threads);
    this.miner.start();
  }

  public stop() {
    this.miner.stop();
  }

  public isRunning() {
    return this.miner ? this.miner.isRunning() : false;
  }

  public onUserChange(user: string) {
    localStorage.setItem('yoc:miner:user', user);
    this.createMiner();
  }

  public onThreadsChange(threads: number) {
    if (this.isRunning()) {
      this.miner.setNumThreads(threads);
    }
  }

  private createMiner() {
    const options = {
      threads: this.threads
    };

    if (this.user) {
      this.miner = CoinHive.User('rBJeDcY13O7Q65oSmJlYgUYzipc2pDGH', this.user, options);
    } else {
      this.miner = CoinHive.Anonymous('rBJeDcY13O7Q65oSmJlYgUYzipc2pDGH', options);
    }
  }

  private onFound(data: any) {
    console.log('onFound:', data);
    //this.totalHashes = data.hashes;
    //this.hashesPerSecond = data.hashesPerSecond;
  }

  private onAccepted(data: any) {
    console.log('onAccepted:', data);
  }
}
