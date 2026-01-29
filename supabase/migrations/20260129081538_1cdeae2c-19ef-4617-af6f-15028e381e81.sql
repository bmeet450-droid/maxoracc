-- Fix 1: Explicitly deny INSERT on contact_submissions table for all users
-- (The edge function uses service role key, so it bypasses RLS)
CREATE POLICY "Deny all insert access"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (false);

-- Fix 2: Restrict avatar storage to only allow users to view their own avatars
-- First drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;

-- Create a new restrictive policy that only allows users to view their own avatars
CREATE POLICY "Users can view their own avatar"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);