-- Create table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert (edge function uses service role)
CREATE POLICY "Service role can insert submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Create policy for service role to update
CREATE POLICY "Service role can update submissions"
ON public.contact_submissions
FOR UPDATE
USING (true);

-- Create policy for authenticated admins to view (if needed later)
CREATE POLICY "Service role can view submissions"
ON public.contact_submissions
FOR SELECT
USING (true);

-- Add index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);