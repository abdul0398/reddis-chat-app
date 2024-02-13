'use client'
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"  ;


    interface SocketProviderProps {
        children?:React.ReactNode,
    }

    interface ISocketContext {
        sendMessage: (msg:string) => any;
        messages:string[];
    }


const SocketContext = React.createContext<ISocketContext | null>(null);


export const useSocket = ()=>{
    const state = useContext(SocketContext);
    if (!state) throw new Error(`State not Found`);
    
    return state;
}

export const SocketProvider:React.FC<SocketProviderProps> = ({children})=>{
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    
    const sendMessage : ISocketContext['sendMessage'] = useCallback((msg)=>{
        if(socket){
            console.log(msg);
            socket.emit('event:message', {message:msg});
        }
        
    },
    [socket]
    )

    const onMessageRec = useCallback((msg:string)=>{
        const message :{message:string} = JSON.parse(msg);
        setMessages((prev)=>[...prev, message.message]);
        console.log(`New Message Rec.`, msg);
    }, [])

    useEffect(()=>{
        const _socket = io("http://localhost:8000");
        _socket.on('message', onMessageRec);
        setSocket(_socket);
        return ()=>{
            _socket.disconnect();
            _socket.off('message', onMessageRec);
            setSocket(undefined)
        };

    }, [])



    return (
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}
