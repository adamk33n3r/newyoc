import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { ITile } from './parser';
import { Vector2 } from './vector2';

interface ITileInfo {
    key: string;
    value: any;
}

@Component({
    templateUrl: './stardew.tile-edit.modal.component.html',
})
export class ObjectModalComponent {
    public tileInfo: any[] = [];
    public set tile (tile: ITile) {
        this._tile = tile;
        for (const prop in tile) {
            const val = tile[prop];
            if ((typeof val === 'number' && isNaN(val)) || val === undefined) {
                continue;
            }
            this.tileInfo.push({
                key: prop,
                value: tile[prop],
            });
        }
    }

    private _tile: ITile;

    constructor(private dialogRef: MatDialogRef<ObjectModalComponent>) {}

    public isVector(tileInfo: ITileInfo): boolean {
        return tileInfo.value.constructor === Vector2;
    }

    public close() {
        for (const tileInfo of this.tileInfo) {
            this._tile[tileInfo.key] = tileInfo.value;
        }
        this.dialogRef.close(this._tile);
    }
}
