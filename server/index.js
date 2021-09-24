import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); 

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

app.get("/",(req,res) => {
    res.send("Caller API ");
});

const users = {};
const socketToRoom = {};

io.on('connection', socket => {

    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("allExceptMe", usersInThisRoom);

        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
    
            delete socketToRoom[socket.id]; 
            let room = users[roomID].filter(id => id !== socket.id);
            users[roomID] = room;

            if (room.length === 0) {
                delete users[roomID];
            }
        });

        socket.on("sending signal", (data) => {
            io.to(data.receiver).emit('user-joined', { signal: data.signal, sender: data.sender });
        });
    
        socket.on("returning signal", (data) => {
            io.to(data.sender).emit('receiving returned signal', { signal: data.signal, receiver: socket.id });
        });
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});