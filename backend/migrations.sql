-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create strokes table
CREATE TABLE IF NOT EXISTS strokes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  prev_x FLOAT NOT NULL,
  prev_y FLOAT NOT NULL,
  color VARCHAR(20) NOT NULL,
  stroke_width INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on room_id for faster queries
CREATE INDEX IF NOT EXISTS idx_strokes_room_id ON strokes(room_id);

-- Add foreign key constraint
ALTER TABLE strokes
  ADD CONSTRAINT fk_strokes_room_id
  FOREIGN KEY (room_id) REFERENCES rooms(id)
  ON DELETE CASCADE;
