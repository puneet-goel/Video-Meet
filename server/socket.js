import { io } from "./index.js";

const getTime = () => {
    const time = new Date();
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const logic = (socket) => {

    try{
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

                socket.to(roomID[1]).emit('incoming message', {
                    message: `${name} left`, 
                    sender: socket.id, 
                    name: name,  
                    type: 'user-left',
                    time: getTime()
                });
                socket.to(roomID[1]).emit('user-left',socket.id);
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
                io.to(data.roomID).emit('incoming message', data);
            });

            //send everyone in the room that socket joined
            io.to(roomID).emit('incoming message', { 
                message: `${name} joined`, 
                sender: socket.id, 
                name: name,  
                type: 'user-join',
                time: getTime()
            });
        });
    }catch(err){
        console.log(err);
    };
};

export default logic;