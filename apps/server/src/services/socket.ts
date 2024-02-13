import { Server } from "socket.io";
import Redis  from "ioredis";


const pub = new Redis({
    host:"redis-20c57bfe-abdul77789-83fa.a.aivencloud.com",
    username:"default",
    port:15661,
    password:"AVNS_JJOoN9AS9yxDHVNaVR8"
});
const sub = new Redis({
    host:"redis-20c57bfe-abdul77789-83fa.a.aivencloud.com",
    username:"default",
    port:15661,
    password:"AVNS_JJOoN9AS9yxDHVNaVR8"
});



class SocketService{
    private _io:Server
    
    constructor(){
        console.log("Init Socket Service..");
        this._io = new Server({
            cors:{
                allowedHeaders:["*"],
                origin:"*",
            }
        });
        sub.subscribe("MESSAGES")

    }

    public initListeners(){
        const io = this.io;
        console.log("Init Socket Listener...");
        io.on('connect', (socket)=>{
            console.log(`New Socket Connected`, socket.id);
            socket.on('event:message', async ({message}:{message:string})=>{
                // publish this message to reddis
                await pub.publish("MESSAGES", JSON.stringify({message}));
                console.log(`New Message Rec.`, message);
            });
        })
        sub.on("message", (channel, message)=>{
            if(channel === "MESSAGES"){
                console.log(`New Message Rec. on Channel: ${channel}`, message);
                io.emit("message", message);
            }
        })
    }

    get io(){
        return this._io;
    }
}


export default SocketService;