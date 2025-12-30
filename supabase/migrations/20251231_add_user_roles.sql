-- Add role field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update blueprints DELETE policy to allow admins
DROP POLICY IF EXISTS "Users can delete their own blueprints" ON blueprints;
CREATE POLICY "Users can delete their own blueprints or admins can delete any"
  ON blueprints FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Update squads DELETE policy to allow admins
DROP POLICY IF EXISTS "Users can delete their own squads" ON squads;
CREATE POLICY "Users can delete their own squads or admins can delete any"
  ON squads FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
