"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "@/config";

function RoomCanvas({roomId}: {roomId: string}) {
    const[socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTNjNTNhNS1jMDBhLTQyNDUtOTEzOS1jNjA2NzcwNTQ4ODQiLCJpYXQiOjE3NTE3ODUzMTR9.TBWYVdcJxk4kG0yJtDZGw3_ACoT55SfzvxkWWZ6cfeQ`);

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId,
            });
            console.log(data);
            ws.send(data);
        }
    },[roomId]);
    if(!socket) {
        return(
            <div>
                Connecting to the Server...
            </div>
        )
    }
  return (
    <Canvas roomId={roomId} socket={socket} />
  )
}
export default RoomCanvas;