import { Injectable, EventEmitter } from '@angular/core';
import * as socketio from 'socket.io-client';

import { Chat, Stream } from '../../../../shared/constants/sockets';

import { environment } from '../../environments/environment';

// interface SocketMessage {
//     event: string;
//     data: any;
// }

// class MessageEmitter<T> extends EventEmitter<T> {
//     public subscribe(generatorOrNext?: (message: T) => void, error?: any, complete?: any): any {
//         super.subscribe(generatorOrNext, error, complete);
//     }
// }

export interface ChatMessage {
    user: any;
    text: string;
    playlist: string;
    timestamp: number;
}

@Injectable()
export class Socket {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = socketio(environment.socketURI);
    }

    // Chat signatures
    public on(event: Chat.Connect | Chat.Disconnect, fn: (user: any) => void): void;
    public on(event: Chat.Message, fn: (message: ChatMessage) => void): void;
    // Stream signatures
    public on(event: Stream.ViewerCount, fn: (count: number) => void): void;
    // Implementation
    public on(event: string, fn: (data?: any) => void) {
        this.socket.on(event, fn);
    }

    // Chat signatures
    public emit(event: Chat.Connect, user: any): void;
    public emit(event: Chat.Message, message: ChatMessage): void;
    public emit(event: string, ...args: any[]): void;
    // Implementation
    public emit(event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }
}
