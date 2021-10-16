import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import nodemailer from "nodemailer";
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
        origin: ["http://localhost:3000","https://v-meet-puneet.netlify.app"],
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

app.post('/sendMail', async(req,res) => {

    const link = req.body.link;
    const users = req.body.users;
    const name = req.body.name;

    const html = `
        <h1>Invitation From ${name}</h1>
        <p>You have been invited for the meeting. </p>
        <p>Meeeting Code: ${link} </p>
        <p>Meeting Link: https://v-meet-puneet.netlify.app/${link}</p>
    `

    try{

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'puneetvideomeet@gmail.com',
                pass: 'bftfyvonyzveqbxt'
            }
        });
        
        let mailDetails = {
            from: 'V-Meet puneetvideomeet@gmail.com',
            to: `${users}`,
            cc: `${users}`,
            subject: 'Invitation for the Group Meeting',
            html: html 
        };
        
        const info = await mailTransporter.sendMail(mailDetails);

        res.status(200).send('Success');
    }catch(err){
        res.status(404).send("Error");
    };
});

io.on('connection', logic);

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});