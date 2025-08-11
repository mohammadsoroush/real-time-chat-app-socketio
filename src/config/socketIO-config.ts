import { io, Socket } from "socket.io-client";
const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
export default socket;
