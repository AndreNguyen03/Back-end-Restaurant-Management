import { Server } from "socket.io";


let io;

const setupSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
    });


    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);


        // Khi user ngắt kết nối
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};


export  {setupSocket, getIo};
