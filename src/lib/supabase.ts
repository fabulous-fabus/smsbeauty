import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DevisRow = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  service: string;
  message: string;
  statut: 'en_attente' | 'traite' | 'refuse';
  reponse: string | null;
  created_at: string;
  repondu_at: string | null;
};

export type BlogArticle = {
  id: string;
  titre: string;
  slug: string;
  categorie: string;
  extrait: string;
  contenu: string;
  image_url: string | null;
  video_url: string | null;
  publie: boolean;
  created_at: string;
  updated_at: string;
};
