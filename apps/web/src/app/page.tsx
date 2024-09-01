'use client'

import { useState } from "react";
import { useSocket } from "../../context/SocketProvider";

export default function Home() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('')
  return (
    <div>
      <div>
        <input onChange={(e) => setMessage(e.target.value)} className="text-black w-[200px] h-[50px] p-[10px] border-solid rounded-full" placeholder="Message..." />
        <button onClick={(e) => sendMessage(message)} className=" h-[50px] w-[50px] rounded-[10px]">Send</button>
      </div>
      <div>
        <h1>All Messages will appear here</h1>
      </div>
      <div>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
