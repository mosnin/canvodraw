const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createRoom = async () => {
  const response = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.roomId;
};

export const getRoomStrokes = async (roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/strokes`);
  const data = await response.json();
  return data.strokes;
};
