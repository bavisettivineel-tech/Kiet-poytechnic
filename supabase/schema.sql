-- KIET Diploma Portal - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- =====================================================
-- 1. STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  year INTEGER NOT NULL CHECK (year IN (1, 2, 3)),
  branch VARCHAR(10) NOT NULL DEFAULT 'CME',
  phone VARCHAR(15),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast roll number lookups
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);
CREATE INDEX IF NOT EXISTS idx_students_year_branch ON students(year, branch);

-- =====================================================
-- 2. STAFF TABLE (CTPOS & Admin Staff)
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  login_id VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('ctpos', 'administrative_staff')),
  assigned_year INTEGER CHECK (assigned_year IN (1, 2, 3)),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_login ON staff(login_id);

-- =====================================================
-- 3. ATTENDANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  roll_number VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
  marked_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Critical indexes for attendance queries
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_roll ON attendance(roll_number);

-- =====================================================
-- 4. INTERNAL MARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS internal_marks (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  mid1 INTEGER DEFAULT 0 CHECK (mid1 >= 0 AND mid1 <= 50),
  mid2 INTEGER DEFAULT 0 CHECK (mid2 >= 0 AND mid2 <= 50),
  mid3 INTEGER DEFAULT 0 CHECK (mid3 >= 0 AND mid3 <= 50),
  assignments INTEGER DEFAULT 0 CHECK (assignments >= 0 AND assignments <= 20),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marks_student ON internal_marks(student_id);

-- =====================================================
-- 5. FEE STRUCTURES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_structures (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  year INTEGER,
  academic_year VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FEE PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_payments (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_mode VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  recorded_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON fee_payments(student_id);

-- =====================================================
-- 7. TRANSPORT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transport (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  route VARCHAR(100) NOT NULL,
  bus_number VARCHAR(50),
  pickup_point VARCHAR(255),
  fee DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  academic_year VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transport_student ON transport(student_id);

-- =====================================================
-- 8. NOTICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notices (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target VARCHAR(50) DEFAULT 'all',
  posted_by VARCHAR(100),
  role VARCHAR(30),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);

-- =====================================================
-- 9. SYSTEM CONFIG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_config (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config values
INSERT INTO system_config (key, value) VALUES
  ('college_name', 'Kakinada Institute of Engineering and Technology'),
  ('short_name', 'KIET'),
  ('location', 'Korangi, Kakinada, Andhra Pradesh'),
  ('college_code', '371'),
  ('branch_code', 'CM'),
  ('academic_year', '2025-2026'),
  ('tuition_fee', '35000'),
  ('transport_fee', '12000')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (customize based on auth setup)
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on staff" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on internal_marks" ON internal_marks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fee_payments" ON fee_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on transport" ON transport FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notices" ON notices FOR ALL USING (true) WITH CHECK (true);
