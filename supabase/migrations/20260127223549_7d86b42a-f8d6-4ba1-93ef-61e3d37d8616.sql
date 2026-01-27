-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can insert submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Service role can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Service role can view submissions" ON public.contact_submissions;

-- Create restrictive policies - only service role can access (no public access)
-- Regular users/anon cannot access this table directly
CREATE POLICY "Deny all direct access"
ON public.contact_submissions
FOR ALL
USING (false);