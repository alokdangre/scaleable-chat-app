import { Redis } from "ioredis";
import { Server } from "socket.io";
import prismaClient from "./prisma";



const pub = new Redis({
    host: '127.0.0.1',
    port: 6379,
});

const sub = new Redis({
    host: '127.0.0.1',
    port: 6379,
});

class SocketService {
    private _io: Server;

    constructor(){
        console.log("Init Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*',
            },
        });
        
        sub.subscribe('MESSAGES');
    }

    public initListeners() {
        const io = this._io
        console.log("Init Socket Listeners...");

        io.on('connect', socket => {
            console.log(`New Socket Connected`, socket.id)

            // console.log(socket);

            socket.on('event:message', async ({message} : {message: string}) => {
                console.log('New Message recieved :', message);
                //publish messages on redis
                await pub.publish('MESSAGES', JSON.stringify({message}));
            })
        })

        sub.on('message',async (channel, message) => {
            if(channel === 'MESSAGES'){
                console.log('new message', message)
                io.emit("message", message);
                await prismaClient.message.create({
                    data: {
                        text: message,
                    }
                })
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;