import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logic from "./socket.js";

dotenv.config(); 

const app = express();
app.use([
    cors(),
    bodyParser.json({ limit: '30mb', extended: true}),
    bodyParser.urlencoded({ limit: '30mb', extended: true})
]);

const server = createServer(app);
export const io = new Server(server, {
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

io.on('connection', logic);

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});