import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);

export const createRoom = async () => {
  const result = await query(
    'INSERT INTO rooms (id, created_at) VALUES (gen_random_uuid(), NOW()) RETURNING id'
  );
  return result.rows[0].id;
};

export const getRoomStrokes = async (roomId) => {
  const result = await query(
    'SELECT * FROM strokes WHERE room_id = $1 ORDER BY created_at ASC',
    [roomId]
  );
  return result.rows;
};

export const saveStroke = async (stroke) => {
  await query(
    `INSERT INTO strokes (id, room_id, x, y, prev_x, prev_y, color, stroke_width, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW())`,
    [stroke.roomId, stroke.x, stroke.y, stroke.prevX, stroke.prevY, stroke.color, stroke.strokeWidth]
  );
};
