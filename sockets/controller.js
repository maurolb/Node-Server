const { jwtChecker } = require("../helpers/jwt-checker");
const ChatMessages = require("../models/chat-messages");

const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {
    const user = await jwtChecker(socket.handshake.headers['x-token']);
    if(!user){
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    io.emit('receive-messages', chatMessages.last10);

    // Conectar usuario especial
    socket.join(user.id); // global, socket.id, user.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id)
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({uid, message}) => {

        if(uid){
            // Mensaje privado
            socket.to(uid).emit('private-message', {de: user.name, message})
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chatMessages.last10)
        }
    });

}

module.exports = {
    socketController,
}