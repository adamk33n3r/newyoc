import debug from 'src/logger';
import * as request from 'request-promise-native';

import { Chat } from '../../../shared/constants/sockets';

interface Sock extends SocketIO.Socket {
    user: any;
}

export class Socket {
    constructor(private socket: SocketIO.Server) {
        this.socket.on('connection', (sock: Sock) => {
            debug('a fine user connected', sock.handshake.address);
            sock.on('disconnect', () => {
                debug('user disconnected', sock.handshake.address);
                this.socket.emit(Chat.Disconnect, sock.user);
            });
            sock.on(Chat.Connect, (user: any) => {
                debug(Chat.Connect, user);
                sock.user = user;
                this.socket.emit(Chat.Connect, user);
            });
            sock.on(Chat.Message, (msg: string) => {
                debug(Chat.Message, msg);
                this.socket.emit(Chat.Message, msg);
            });
        });

        setInterval(() => {
            request('http://eon.adam-keenan.net:8081/stats.json', {
                json: true,
            })
            .then((body) => {
                const rtmp = body.rtmp;
                const streams = rtmp.servers[0][0].live.streams;
                let foundStream = false;
                for (const stream of streams) {
                    if (stream.name === 'default') {
                        this.socket.emit('stream:viewerCount', stream.nclients - 1);
                        foundStream = true;
                        break;
                    }
                }
                if (!foundStream) {
                    this.socket.emit('stream:viewerCount', 0);
                }
            })
            .catch((e) => {
            });
        }, 10000);
    }
}
