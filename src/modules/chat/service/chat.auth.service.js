import { scketConnections } from "../../../DB/model/User.model.js";
import { authenticationSocket } from "../../../middlewere/auth.socket.middlewere.js";






const onlineUsers = new Map();

export const regiserSocket = async (socket) => {
    const { data } = await authenticationSocket({ socket });
    if (!data.valid) {
        return socket.emit("socketErrorResponse", data);
    }

    socket.userId = data.user._id.toString();
    scketConnections.set(socket.userId, socket.id);


    onlineUsers.set(socket.userId, socket.id);
    console.log("Online Users:", onlineUsers);

   
    socket.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));

    return "done";
};

export const logoutSocket = async (socket) => {
    return socket.on("disconnect", async () => {
 
        onlineUsers.delete(socket.userId);

        console.log("Socket disconnected for user:", socket.userId);

   
        socket.broadcast.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));

        return "done";
    });
};
