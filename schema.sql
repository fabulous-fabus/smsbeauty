-- Create the devis (quote request) table
CREATE TABLE IF NOT EXISTS public.devis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'traite', 'refuse')),
  reponse TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  repondu_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert
CREATE POLICY "Allow anyone to insert devis" ON public.devis
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow anyone to view their own devis (by email)
CREATE POLICY "Allow users to view their devis" ON public.devis
  FOR SELECT USING (true);

-- Create an index for faster queries by email
CREATE INDEX IF NOT EXISTS idx_devis_email ON public.devis(email);
CREATE INDEX IF NOT EXISTS idx_devis_created_at ON public.devis(created_at DESC);
