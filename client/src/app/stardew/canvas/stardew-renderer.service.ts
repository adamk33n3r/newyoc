import {
    IFarm,
    ITile,
} from '../parser/types';
import { Vector2 } from '../vector2';
import { ArrayUtils } from '../utils';

import { CanvasRenderer, Color } from './canvas-renderer.service';
import { SVSaveParser } from '../parser/SVSaveParser.service';

export interface IColorMap {
    [name: string]: Color;
}

export class StardewRenderer extends CanvasRenderer {
    private overlayRenderer: CanvasRenderer;

    constructor(
        canvas: HTMLCanvasElement,
        overlay: HTMLCanvasElement,
        private farm: IFarm,
        private colorMap: IColorMap,
        onClick: (tile: ITile) => void,
    ) {
        super(canvas, SVSaveParser.MapWidth, SVSaveParser.MapHeight, 10);
        console.log(Vector2, new Vector2(1, 2));

        // Draw dirt
        this.drawRect(0, 0, this.Width, this.Height, 'burlywood');

        // Setup overlay renderer
        this.overlayRenderer = new CanvasRenderer(overlay, SVSaveParser.MapWidth, SVSaveParser.MapHeight, 10);
        this.overlayRenderer.onMouseOver((mousePos) => {
            this.overlayRenderer.clear();
            this.overlayRenderer.drawPixel(mousePos, 1, 'red');
            this.overlayRenderer.drawText(new Vector2(0, 0), `Pos: ${mousePos}`);
        });
        this.overlayRenderer.onMouseClick((mousePos) => {
            console.log(`clicked at ${mousePos}`);
            const tile = this.getTileAt(mousePos);
            console.log("clicked on tile", tile);
            this.overlayRenderer.drawPixel(mousePos, 1, 'blue');
            onClick(tile);
        });
    }

    public drawFarm() {
        for (const feature of this.farm.terrainFeatures) {
            if (feature === null) {
                continue;
            }
            const color = this.colorMap[feature.type] || 'deeppink';
            this.drawPixel(feature.location, 1, color);
        }
        for (const object of this.farm.objects) {
            if (object === null) {
                continue;
            }
            const color = this.colorMap[object.name] || 'yellow';
            this.drawPixel(new Vector2(object.location.x + .25, object.location.y + .25), .5, color);
        }
    }

    private getTileAt(pos: Vector2): ITile {
        // Check for object.
        const object = ArrayUtils.ArrayGet2D(this.farm.objects, pos.x, pos.y, SVSaveParser.MapWidth);
        if (object) {
            console.log('was object');
            return object;
        }

        // Check for terrain feature.
        console.log('was feature');
        const terrainFeature = ArrayUtils.ArrayGet2D(this.farm.terrainFeatures, pos.x, pos.y, SVSaveParser.MapWidth);
        return terrainFeature;
    }
}

/**
 *    0  1  2  3  4  5  6  7  8  9
 * 0: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 * 1: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 * 2: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 * 3: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 * 4: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 */
