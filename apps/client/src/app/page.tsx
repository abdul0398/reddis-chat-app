'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSocket } from "../../context/SocketProvider";
import { useState } from "react";
export default function Home() {
  const {sendMessage, messages} = useSocket();
  const [message, setMessage] = useState('');
  return (
    <div className="h-full w-full flex place-content-center">
      <div className="h-1/2 lg:w-1/4 md:w-1/2 mx-3 my-auto rounded-md w-10/12 relative border border-slate-700 bg-white">
        {messages.map((msg, index)=>{
          return (
            <li key={index} className="p-4 border-b border-slate-700 list-none">
              {msg}
            </li>
          );
        
        })}
        <div className="flex p-4 absolute w-full bottom-0">
          <input type="text" onChange={e=>setMessage(e.target.value)} className="w-full border border-slate-500 rounded-md me-2 px-2 outline-none" />
          <Button onClick={()=>sendMessage(message)} variant={"outline"} className="border border-slate-500">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
