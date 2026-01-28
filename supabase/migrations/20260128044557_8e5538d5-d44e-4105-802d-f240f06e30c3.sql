-- Add explicit RESTRICTIVE SELECT policy for additional clarity
-- This is redundant since "FOR ALL" already covers SELECT, but makes the intent explicit
CREATE POLICY "Deny all read access"
ON public.contact_submissions
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);