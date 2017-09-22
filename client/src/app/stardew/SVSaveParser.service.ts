import { XMLParser } from '../XMLParser.service';

export interface ISaveGame {
    player: Player;
    stats: IStats;
}

export class Player {
    public name: string = undefined;
    public farmName: string = undefined;
    public favoriteThing: string = undefined;
    public shirt: number = undefined;
    public hair: number = undefined;
    public skin: number = undefined;
    public accessory: number = undefined;
    public facialHair: number = undefined;
    public questLog: any[];
    public items: any[];
    [key: string]: any;
}

export interface IFarm {
    buildings: any[];
    objects: IObject[];
    terrainFeatures: ITerrainFeature[];
}

interface ILocation {
    x: number;
    y: number;
}

interface IObject {
    name: string;
    location: ILocation;
}

interface ITerrainFeature {
    type: string;
    location: ILocation;
}

export interface IQuest {
    type: string;
    title: string;
    description: string;
}

export interface IStats {
    seedsSown: number;
    itemsShipped: number;
}

export class SVSaveParser extends XMLParser {
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
        const objects: IObject[] = [];
        for (const item of objectItems) {
            const object = this.getNode('./value/Object', item);
            objects.push({
                location: {
                    x: this.getNumber('./tileLocation/X', object),
                    y: this.getNumber('./tileLocation/Y', object),
                },
                name: this.getText('./Name', object),
            });
        }
        return objects;
    }

    private getFarmTerrainFeatures(farm: Node) {
        const terrainFeatures = this.getNodes('./terrainFeatures/item', farm);
        const features: ITerrainFeature[] = [];
        for (const item of terrainFeatures) {
            const terrainFeature = this.getNode('./value/TerrainFeature', item);
            features.push({
                location: {
                    x: this.getNumber('./key/Vector2/X', item),
                    y: this.getNumber('./key/Vector2/Y', item),
                },
                type: this.getAttribute('type', terrainFeature),
            });
        }
        return features;
    }
}
