declare global {
    interface JWPlayer {
        onPlaylistItem(callback: (event: PlaylistItem) => void): void;
    }
}

export interface Event {
    index: number;
    item: {};
    type: string;
}

export interface PlaylistItem extends Event {
    item: {
        allSources: any[],
        description: string;
        file: string;
        sources: any[];
        title: string;
        tracks: any[];
    };
}
