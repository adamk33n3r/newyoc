import {
    IFarm,
    ITile,
} from '../parser/types';
import { Vector2 } from '../vector2';
import { ArrayUtils } from '../utils';

import { CanvasRenderer } from './canvas-renderer.service';
import { SVSaveParser } from '../parser/SVSaveParser.service';

export class StardewRenderer extends CanvasRenderer {
    private overlayRenderer: CanvasRenderer;

    constructor(canvas: HTMLCanvasElement, overlay: HTMLCanvasElement, private farm: IFarm) {
        super(canvas, SVSaveParser.MapWidth, SVSaveParser.MapHeight, 10);

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
            const object = this.getTileAt(mousePos);
            console.log("clicked on object", object);
            this.overlayRenderer.drawPixel(mousePos, 1, 'blue');
        });
    }

    public drawFarm() {
        for (const feature of this.farm.terrainFeatures) {
            if (feature === null) {
                continue;
            }
            let color: string;
            switch (feature.type) {
                case 'Grass':
                    color = 'green';
                    break;
                case 'Tree':
                    color = 'darkgreen';
                    break;
                case 'FruitTree':
                    color = 'pink';
                    break;
                case 'Flooring':
                    color = 'grey';
                    break;
                default:
                    color = 'black';
            }
            this.drawPixel(feature.location, 1, color);
        }
        for (const object of this.farm.objects) {
            if (object === null) {
                continue;
            }
            this.drawPixel(new Vector2(object.location.x + .25, object.location.y + .25), .5, 'yellow');
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
