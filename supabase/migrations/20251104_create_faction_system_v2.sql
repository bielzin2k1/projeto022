/*
  # Faction Management System - Versão 2 (Participantes Manuais)
  
  Sistema completo de gerenciamento tático de facção para FiveM
  MUDANÇA: Participantes são nomes em texto, não FK para profiles
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

-- Create actions table (participantes como JSONB array de strings)
CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('pequeno', 'medio', 'grande')),
  action_name text NOT NULL,
  date_time timestamptz NOT NULL,
  result text NOT NULL CHECK (result IN ('vitoria', 'derrota', 'cancelada')),
  manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participants jsonb DEFAULT '[]'::jsonb, -- Array de nomes de participantes
  observations text DEFAULT '',
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_actions_manager ON actions(manager_id);
CREATE INDEX IF NOT EXISTS idx_actions_created_by ON actions(created_by);
CREATE INDEX IF NOT EXISTS idx_actions_date_time ON actions(date_time);
CREATE INDEX IF NOT EXISTS idx_actions_result ON actions(result);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON profiles(reputation DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Anyone authenticated can view profiles" ON profiles;
CREATE POLICY "Anyone authenticated can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Actions policies
DROP POLICY IF EXISTS "Authenticated users can view actions" ON actions;
CREATE POLICY "Authenticated users can view actions"
  ON actions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Gerente and Lider can create actions" ON actions;
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

DROP POLICY IF EXISTS "Creator or Lider can update actions" ON actions;
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

DROP POLICY IF EXISTS "Lider can delete actions" ON actions;
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

