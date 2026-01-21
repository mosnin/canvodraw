import { useState } from 'react';
import { createRoom } from './api';

export default function RoomSelector({ onRoomSelect }) {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const newRoomId = await createRoom();
      onRoomSelect(newRoomId);
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      onRoomSelect(roomId.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Realtime Draw</h1>
          <p className="text-gray-600">Create or join a drawing room</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Creating...' : 'Create New Room'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-3">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!roomId.trim()}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
