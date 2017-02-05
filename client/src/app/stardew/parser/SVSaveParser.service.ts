import { XMLParser } from '../../XMLParser.service';

import {
    Player,
    IFarm,
    IObject,
    IQuest,
    ISaveGame,
    IStats,
    ITerrainFeature,
    ITile,
} from './types';
import { Vector2 } from '../vector2';

export class SVSaveParser extends XMLParser {
    private static mapWidth = 77;
    public static get MapWidth () {
        return SVSaveParser.mapWidth;
    }
    private static mapHeight = 64;
    public static get MapHeight () {
        return SVSaveParser.mapHeight;
    }

    private player: Player;

    constructor(saveGameXML: Document) {
        super(saveGameXML);
    }

    public getPlayer(): Player {
        if (!this.player) {
            const player = this.getNode('/player');
            this.player = new Player();
            for (const attr in this.player) {
                this.player[attr] = this.getText(`./${attr}`, player);
            }
            const questNodes = this.getNodes('./questLog/Quest', player);
            this.player.questLog = [];
            for (const questNode of questNodes) {
                this.player.questLog.push({
                    type: this.getAttribute('type', questNode),
                    description: this.getText('./questDescription', questNode),
                    title: this.getText('./questTitle', questNode),
                });
            }
        }

        return this.player;
    }

    public getFarm(): IFarm {
        const farmNode = this.getNode('/locations/GameLocation[@xsi:type="Farm"]');
        console.log(farmNode);
        return {
            buildings: [],
            objects: this.getFarmObjects(farmNode),
            terrainFeatures: this.getFarmTerrainFeatures(farmNode),
        };
    }

    public getAttribute(attribute: string, node: Node) {
        return super.getAttribute(`xsi:${attribute}`, node);
    }

    protected evaluate(xPath: string, base?: Node, resultType = XPathResult.ANY_TYPE): XPathResult {
        if (!base) {
            xPath = `/SaveGame${xPath}`;
        }
        return super.evaluate(xPath, base, resultType);
    }

    private getFarmObjects(farm: Node): IObject[] {
        const objectItems = this.getNodes('./objects/item', farm);
        const objects: IObject[] = new Array(SVSaveParser.mapWidth * SVSaveParser.mapHeight).fill(null);
        for (const item of objectItems) {
            const obj = this.getNode('./value/Object', item);
            const object = {
                location: new Vector2(
                    this.getNumber('./tileLocation/X', obj),
                    this.getNumber('./tileLocation/Y', obj),
                ),
                name: this.getText('./Name', obj),
            };
            objects[(object.location.y - 1) * SVSaveParser.mapWidth + object.location.x] = object;
        }
        return this.sortTiles(objects);
    }

    private getFarmTerrainFeatures(farm: Node): ITerrainFeature[] {
        const terrainFeatures = this.getNodes('./terrainFeatures/item', farm);
        const features: ITerrainFeature[] = new Array(SVSaveParser.mapWidth * SVSaveParser.mapHeight).fill(null);
        for (const item of terrainFeatures) {
            const terrainFeature = this.getNode('./value/TerrainFeature', item);
            const feature = {
                location: new Vector2(
                    this.getNumber('./key/Vector2/X', item),
                    this.getNumber('./key/Vector2/Y', item),
                ),
                type: this.getAttribute('type', terrainFeature),
            };
            features[(feature.location.y - 1) * SVSaveParser.mapWidth + feature.location.x] = feature;
        }
        return this.sortTiles(features);
    }

    private sortTiles<T extends ITile>(tiles: T[]): T[] {
        return tiles;
        // return tiles.sort((a, b) => {
        //     const xSign = Math.sign(a.location.x - b.location.x);
        //     const ySign = Math.sign(a.location.y - b.location.y);
        //     if (ySign === 0) {
        //         return xSign;
        //     } else {
        //         return ySign;
        //     }
        // });
    }
}
