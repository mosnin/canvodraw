const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const connectWebSocket = (roomId, onStroke) => {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('WebSocket connected');
    ws.send(JSON.stringify({
      type: 'join',
      roomId
    }));
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'stroke') {
      onStroke(message.data);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return ws;
};

export const sendStroke = (ws, stroke) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'stroke',
      data: stroke
    }));
  }
};
