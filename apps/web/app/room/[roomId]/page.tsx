import axios from "axios";
import React from 'react'
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
    console.log("heeloo");
    const response = await axios.post(`${BACKEND_URL}/room/`,{
      name: slug
    })
    console.log(response.data.room?.id);

    return response.data.room?.id;
}

async function room( {params}: {params:any}) {
    const parsedParams = await params;
    const slug = parsedParams.roomId
    let roomId = "";
    roomId = await getRoomId(slug);
    
    if(!roomId) {
      return <div>
        Loading...
      </div>
    }
    return (
      <div>
        {await ChatRoom({ id: roomId })}
      </div>
    )
}

export default room
