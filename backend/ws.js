import { WebSocketServer } from 'ws';
import { saveStroke } from './db.js';

const rooms = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    let currentRoom = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'join') {
          currentRoom = message.roomId;

          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }
          rooms.get(currentRoom).add(ws);

          console.log(`Client joined room: ${currentRoom}`);
        } else if (message.type === 'stroke') {
          const stroke = message.data;

          await saveStroke(stroke);

          if (currentRoom && rooms.has(currentRoom)) {
            const clients = rooms.get(currentRoom);
            clients.forEach((client) => {
              if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify({
                  type: 'stroke',
                  data: stroke
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (currentRoom && rooms.has(currentRoom)) {
        rooms.get(currentRoom).delete(ws);
        if (rooms.get(currentRoom).size === 0) {
          rooms.delete(currentRoom);
        }
        console.log(`Client left room: ${currentRoom}`);
      }
    });
  });

  return wss;
};
