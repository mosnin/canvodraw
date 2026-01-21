import { useEffect, useRef, useState } from 'react';
import { getRoomStrokes } from './api';
import { connectWebSocket, sendStroke } from './socket';

export default function Canvas({ roomId, onLeave }) {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [loading, setLoading] = useState(true);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ];

  const drawStroke = (ctx, stroke) => {
    ctx.beginPath();
    ctx.moveTo(stroke.prevX, stroke.prevY);
    ctx.lineTo(stroke.x, stroke.y);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    isDrawingRef.current = true;
    lastPosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentPos = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };

    const stroke = {
      roomId,
      x: currentPos.x,
      y: currentPos.y,
      prevX: lastPosRef.current.x,
      prevY: lastPosRef.current.y,
      color,
      strokeWidth
    };

    drawStroke(ctx, stroke);
    sendStroke(wsRef.current, stroke);

    lastPosRef.current = currentPos;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    resizeCanvas();

    const loadStrokes = async () => {
      try {
        const strokes = await getRoomStrokes(roomId);
        strokes.forEach(stroke => drawStroke(ctx, stroke));
      } catch (error) {
        console.error('Failed to load strokes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStrokes();

    wsRef.current = connectWebSocket(roomId, (stroke) => {
      drawStroke(ctx, stroke);
    });

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [roomId]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200 text-sm font-medium"
          >
            Leave
          </button>
          <div className="text-gray-400 text-sm">
            Room: <span className="text-white font-mono">{roomId}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition duration-200 ${
                  color === c ? 'border-blue-500 scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="1">Thin</option>
            <option value="3">Normal</option>
            <option value="5">Thick</option>
            <option value="8">Very Thick</option>
          </select>

          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
            <div className="text-white text-lg">Loading canvas...</div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="touch-none cursor-crosshair bg-white"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
