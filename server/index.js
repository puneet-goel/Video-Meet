import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketLogic from './socket.js';
import createTransporter from './transporter.js';

dotenv.config();

const app = express();
app.use([
  cors(),
  bodyParser.json({ limit: '30mb', extended: true }),
  bodyParser.urlencoded({ limit: '30mb', extended: true }),
]);

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://v-meet-puneet.netlify.app'],
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Video Meet (V-Meet) API');
});

app.get('/rooms', (req, res) => {
  try {
    const data = io.of('/').adapter.rooms;
    const rooms = [...data.keys()];
    const ans = rooms.filter((a) => !data.get(a).has(a));

    return res.status(200).json({ message: 'ok', rooms: ans });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/sendMail', async (req, res) => {
  try {
    const link = req.body.link;
    const users = req.body.users;
    const name = req.body.name;

    const html = `
      <h1>Invitation From ${name}</h1>
      <p>You have been invited for the meeting. </p>
      <p>Meeeting Code: ${link} </p>
      <p>Meeting Link: https://v-meet-puneet.netlify.app/${link}</p>
    `;

    const sendEmail = async (emailOptions) => {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions);
    };

    const mailDetails = {
      from: `Video Meet  ${process.env.EMAIL}`,
      to: `${users}`,
      cc: `${users}`,
      subject: 'Invitation for the Group Meeting',
      html: html,
    };

    await sendEmail(mailDetails);

    return res.status(200).json({ message: 'ok' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

io.on('connection', socketLogic);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
