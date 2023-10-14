import express from 'express';
import { createServer, Server } from 'http';
import { Server as Io } from 'socket.io';

class App {
    public app: express.Application;
    public server: Server;
    private socketIo: Io;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.socketIo = new Io(this.server, {
            cors: {
                origin: '*'
            }
        });

        this.socketIo.on('connection', socket => {
            console.log('teste');

            socket.on('disconnect', () => {
                console.log('usuário desconectado');
            });

            socket.on('message', (message) => {
                socket.broadcast.emit('message', message); //Envia para todo mundo, exceto emissor
                // this.socketIo.emit('message', message); Envia para todos, inclusive o emissor
            });
        });
    }
}

export default App;