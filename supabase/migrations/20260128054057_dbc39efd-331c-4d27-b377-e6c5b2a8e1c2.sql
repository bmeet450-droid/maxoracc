-- Make avatars bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'avatars';

-- Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Create new policy for authenticated users only
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');