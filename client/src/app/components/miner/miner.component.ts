import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Auth, User } from '../../services/auth.service';

declare var CoinHive: any;

@Component({
    selector: 'app-miner',
    templateUrl: './miner.component.html',
    styleUrls: ['./miner.component.sass']
})
export class MinerComponent implements OnInit {
    public totalHashes: number = 0;
    public hashesPerSecond: number = 0;
    public autoStart: boolean = true;
    public user: User = null;
    public threads: number = navigator.hardwareConcurrency / 2;
    public balance: number;

    public siteInfo: {
        xmr?: number;
        rate?: number;
        totalHashes?: number;
        hashesPerSecond?: number;
    } = {};

    public miner: any;

    constructor(private auth: Auth, private http: HttpClient) {
        this.auth.userInfo.subscribe((user) => {
            this.user = user;

            if (user) {
                this.http.get('/api/services/miner/balance', { params: new HttpParams().append('user', this.user.nickname) })
                .subscribe((response: any) => {
                    this.balance = response.balance;
                });
            }
            if (this.autoStart) {
                this.start();
            }
        });
        if (typeof CoinHive !== 'undefined') {
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
        this.createMiner();
        this.miner.start();
    }

    public stop() {
        this.miner.stop();
    }

    public isRunning() {
        return this.miner ? this.miner.isRunning() : false;
    }

    public onThreadsChange(threads: number) {
        if (this.isRunning()) {
            this.miner.setNumThreads(threads);
        }
    }

    private createMiner() {
        if (this.miner) {
            this.miner.stop();
        }
        const options = {
            threads: this.threads,
        };

        if (this.user) {
            console.log('Creating user miner for', this.user.nickname);
            this.miner = CoinHive.User('rBJeDcY13O7Q65oSmJlYgUYzipc2pDGH', this.user.nickname, options);
        } else {
            console.log('Creating anonymous miner');
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
