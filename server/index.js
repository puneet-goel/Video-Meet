import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config(); 

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET','POST']
    }
});

app.get('/',(req,res) => {
    res.send('Video Meet (V-Meet) API');
});

app.get('/rooms', (req,res) => {
    const data = io.of('/').adapter.rooms;
    const rooms = [...data.keys()];
    const ans = rooms.filter((a) => !data.get(a).has(a));
    res.send(ans);
});

io.on('connection', (socket) => {
        
    socket.on('join room', async(roomID,name) => {

        //assign username to the socket 
        socket.data.username = name;

        const peers = await io.in(roomID).fetchSockets();
        if(peers.length === 5){
            socket.emit('room full');
            return;
        }

        let usersInThisRoom = [];
        for(const peer of peers){
            usersInThisRoom.push([peer.id,peer.data.username]);   
        }

        socket.join(roomID);

        //send everyone in the room that socket joined
        socket.to(roomID).emit('incoming messsage', { message: `${name} joined`, sender: socket.id,  type: 'user-join' });
        
        socket.emit('allExceptMe', usersInThisRoom);

        socket.on('forceDisconnect', () => {
            socket.disconnect();
        });

        socket.on('disconnecting', async() =>{
            const room = socket.rooms;
            const roomID = [...room.keys()];

            //when user has joined no room
            if(roomID.length === 1){
                return;
            }

            socket.broadcast.to(roomID[1]).emit('incoming message', { message: `${name} left`, sender: socket.id,  type: 'user-left' });
            socket.broadcast.to(roomID[1]).emit('user-left',socket.id);
        });
    
        socket.on('sending signal', (data) => {
            socket.to(data.receiver).emit('user-joined', { signal: data.signal, sender: data.sender, senderName: data.senderName });
        });
    
        socket.on('returning signal', (data) => {
            socket.to(data.sender).emit('receiving returned signal', { signal: data.signal, receiver: socket.id });
        });

        //Chat Functionality
        //there are three types of message => user joined => user message => user left
        socket.on('send message', (data) => {
            socket.to(data.roomID).emit('incoming messsage', { message: data.message, sender: data.sender, type: 'user-message' });
        });
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});