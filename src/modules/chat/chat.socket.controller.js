import { Server } from "socket.io";
import { logoutSocket, regiserSocket } from "./service/chat.auth.service.js";
import { sendMessage } from "./service/message.service.js";




export const runIo = (httpServer) => {
    const io = new Server(httpServer, {
        cors: "*"
    });
    


 
     return  io.on("connection", async (socket) => {
         console.log(socket.handshake.auth);
         await sendMessage(socket);
        await regiserSocket(socket);
        await logoutSocket(socket);
    });


}