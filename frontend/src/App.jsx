import { useState } from 'react';
import RoomSelector from './RoomSelector';
import Canvas from './Canvas';

export default function App() {
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <>
      {currentRoom ? (
        <Canvas roomId={currentRoom} onLeave={() => setCurrentRoom(null)} />
      ) : (
        <RoomSelector onRoomSelect={setCurrentRoom} />
      )}
    </>
  );
}
