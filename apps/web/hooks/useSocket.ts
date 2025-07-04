import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYTY1NDAyMy1mMzE5LTRmNjEtODY3OS1lNDVkOWUyOWY5ZmQiLCJpYXQiOjE3NTE2MDA4MTJ9.YKl2nY5x1-WCnsq8qHzlQJhpDObQVMTJUy69OWIevdw`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}