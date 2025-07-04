import axios from "axios"
import { BACKEND_URL } from "../app/config"
import React from 'react'
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages;
}

async function ChatRoom({id}: {
    id: string
}) {
  console.log("idofRoooommmm:::::",id);
  const messages = await getChats(id);
  return <ChatRoomClient id={id} messages={messages} />
}

export default ChatRoom;
