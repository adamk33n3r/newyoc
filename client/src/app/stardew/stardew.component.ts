import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { MdDialog } from '@angular/material';

import {
    SVSaveParser,
    Player,
    IFarm,
    ITile,
} from './parser';
import { Vector2 } from './vector2';

import { CanvasRenderer } from './canvas/canvas-renderer.service';
import { StardewRenderer } from './canvas/stardew-renderer.service';
import { ObjectModalComponent } from './stardew.tile-edit.modal.component';

@Component({
    selector: 'app-stardew',
    templateUrl: './stardew.component.html',
    styleUrls: ['./stardew.component.sass'],
})
export class StardewComponent implements OnInit {
    public fileParsed = false;
    private fileName: string;
    private player: Player;
    private farm: IFarm;
    private doc: Document;

    @ViewChild('baseCanvas')
    private baseCanvasRef: ElementRef;
    @ViewChild('overlayCanvas')
    private overlayCanvasRef: ElementRef;

    private renderer: StardewRenderer;

    constructor(private modal: MdDialog) {
    }

    public ngOnInit() {
    }

    public processFile(file: File) {
        if (!file) {
            return;
        }
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(reader.result, 'application/xml');
            this.doc = doc;
            (<any> window)['doc'] = doc;
            this.parseSaveGame(doc);
        };
        reader.readAsText(file);
    }

    public saveFile() {
        const sXML = new XMLSerializer().serializeToString(this.doc);
        const blob = new Blob([sXML], {
            type: 'text/xml',
        });
        const ele = window.document.createElement('a');
        ele.href = window.URL.createObjectURL(blob);
        ele.download = 'savegame.xml';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
    }

    private parseSaveGame(saveGame: Document) {
        const svParser = new SVSaveParser(saveGame);
        this.player = svParser.getPlayer();
        console.log(this.player);
        this.farm = svParser.getFarm();
        // console.log(this.farm.terrainFeatures[0].location, this.farm.terrainFeatures[1].location);
        this.fileParsed = true;


        this.renderer = new StardewRenderer(
            this.baseCanvasRef.nativeElement,
            this.overlayCanvasRef.nativeElement,
            this.farm,
            {
                'Grass': 'green',
                'Tree': 'darkgreen',
                'FruitTree': 'pink',
                'Flooring': 'grey',
                'HoeDirt': 'sandybrown',
                'Stone': 'darkgrey',
                'Stone Fence': 'slategrey',
                'Weeds': 'forestgreen',
                'Twig': 'sienna',
                'Lightning Rod': 'dimgrey',
                'Chest': 'saddlebrown',
                'Worm Bin': 'lightgreen',
            },
            (tile) => {
                const dialogRef = this.modal.open(ObjectModalComponent);
                dialogRef.componentInstance.tile = tile;
                dialogRef.afterClosed().subscribe((result) => {
                    console.log(result);
                });
            },
        );
        this.renderer.drawFarm();
    }
}
