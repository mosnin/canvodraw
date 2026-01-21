import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocket } from './ws.js';
import roomsRouter from './routes/rooms.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/rooms', roomsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
