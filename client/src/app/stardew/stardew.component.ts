import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';

import {
    SVSaveParser,
    Player,
    IFarm,
} from './parser';

import { CanvasRenderer } from './canvas/canvas-renderer.service';
import { StardewRenderer } from './canvas/stardew-renderer.service';

@Component({
    selector: 'app-stardew',
    templateUrl: './stardew.component.html',
    styleUrls: ['./stardew.component.sass'],
})
export class StardewComponent implements OnInit {
    private fileName: string;
    private player: Player;
    private farm: IFarm;
    private fileParsed = false;

    @ViewChild('baseCanvas')
    private baseCanvasRef: ElementRef;
    @ViewChild('overlayCanvas')
    private overlayCanvasRef: ElementRef;

    private renderer: StardewRenderer;

    constructor() {
    }

    public ngOnInit() {
    }

    private processFile(file: File) {
        if (!file) {
            return;
        }
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(reader.result, 'application/xml');
            (<any> window)['doc'] = doc;
            this.parseSaveGame(doc);
        };
        reader.readAsText(file);
    }

    private parseSaveGame(saveGame: Document) {
        const svParser = new SVSaveParser(saveGame);
        this.player = svParser.getPlayer();
        console.log(this.player);
        this.farm = svParser.getFarm();
        console.log(this.farm.terrainFeatures);
        // console.log(this.farm.terrainFeatures[0].location, this.farm.terrainFeatures[1].location);
        this.fileParsed = true;


        this.renderer = new StardewRenderer(
            this.baseCanvasRef.nativeElement,
            this.overlayCanvasRef.nativeElement,
            this.farm,
        );
        this.renderer.drawFarm();
    }
}
