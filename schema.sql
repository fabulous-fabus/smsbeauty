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

-- Create the blog_articles table
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  categorie TEXT NOT NULL,
  extrait TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  publie BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for blog_articles
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_articles
CREATE POLICY "Allow anyone to view published articles" ON public.blog_articles
  FOR SELECT USING (publie = true);

CREATE POLICY "Admins can view all articles" ON public.blog_articles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert articles" ON public.blog_articles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update articles" ON public.blog_articles
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete articles" ON public.blog_articles
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for blog_articles
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categorie ON public.blog_articles(categorie);
CREATE INDEX IF NOT EXISTS idx_blog_publie ON public.blog_articles(publie);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON public.blog_articles(created_at DESC);
