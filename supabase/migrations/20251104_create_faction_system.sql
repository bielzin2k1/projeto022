/*
  # Faction Management System - Complete Database Schema
  
  Sistema completo de gerenciamento tático de facção para FiveM
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'membro' CHECK (role IN ('lider', 'gerente', 'membro')),
  rank text NOT NULL DEFAULT 'Recruta',
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  actions_participated integer NOT NULL DEFAULT 0,
  victories integer NOT NULL DEFAULT 0,
  defeats integer NOT NULL DEFAULT 0,
  reputation integer NOT NULL DEFAULT 0,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('pequeno', 'medio', 'grande')),
  action_name text NOT NULL,
  date_time timestamptz NOT NULL,
  result text NOT NULL CHECK (result IN ('vitoria', 'derrota', 'cancelada')),
  manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  observations text DEFAULT '',
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create action_participants table
CREATE TABLE IF NOT EXISTS action_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(action_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_actions_manager ON actions(manager_id);
CREATE INDEX IF NOT EXISTS idx_actions_created_by ON actions(created_by);
CREATE INDEX IF NOT EXISTS idx_actions_date_time ON actions(date_time);
CREATE INDEX IF NOT EXISTS idx_actions_result ON actions(result);
CREATE INDEX IF NOT EXISTS idx_action_participants_action ON action_participants(action_id);
CREATE INDEX IF NOT EXISTS idx_action_participants_user ON action_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON profiles(reputation DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone authenticated can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Actions policies
CREATE POLICY "Authenticated users can view actions"
  ON actions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gerente and Lider can create actions"
  ON actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('gerente', 'lider')
    )
  );

CREATE POLICY "Creator or Lider can update actions"
  ON actions FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'lider'
    )
  );

CREATE POLICY "Lider can delete actions"
  ON actions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'lider'
    )
  );

-- Action participants policies
CREATE POLICY "Authenticated users can view participants"
  ON action_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gerente and Lider can add participants"
  ON action_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('gerente', 'lider')
    )
  );

CREATE POLICY "Gerente and Lider can remove participants"
  ON action_participants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('gerente', 'lider')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

