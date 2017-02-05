import { Vector2 } from '../vector2';

export interface ISaveGame {
    player: Player;
    stats: IStats;
}

export class Player {
    [prop: string]: any;
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
}

export interface IFarm {
    buildings: any[];
    objects: IObject[];
    terrainFeatures: ITerrainFeature[];
}

export interface ITile {
    location: Vector2;
}

export interface IObject extends ITile {
    name: string;
}

export interface ITerrainFeature extends ITile {
    type: string;
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
