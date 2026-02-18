-- ============================================
-- INIT Logistics - Supabase Migration
-- ============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Attendance Table - stores scanned roll numbers
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_number TEXT NOT NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(roll_number)  -- prevent duplicate scans
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_attendance_roll ON attendance(roll_number);

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (using anon key)
CREATE POLICY "Allow all on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
