import express from 'express';
import { createRoom, getRoomStrokes } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const roomId = await createRoom();
    res.json({ roomId });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.get('/:roomId/strokes', async (req, res) => {
  try {
    const { roomId } = req.params;
    const strokes = await getRoomStrokes(roomId);
    res.json({ strokes });
  } catch (error) {
    console.error('Get strokes error:', error);
    res.status(500).json({ error: 'Failed to get strokes' });
  }
});

export default router;
