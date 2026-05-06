import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { BlogArticle } from '../lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, ArrowLeft, Link2, Upload, Loader, Wand2, X, Image, Zap, Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, Quote, HelpCircle, Minus, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  { value: 'presentation', label: 'Présentation' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'traiteur', label: 'Traiteur' },
  { value: 'robes-soiree', label: 'Robes de Soirée' },
];

function toSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const EMPTY_FORM = {
  titre: '',
  slug: '',
  categorie: 'decoration',
  extrait: '',
  contenu: '',
  image_url: '',
  video_url: '',
  publie: false,
};

type FormState = typeof EMPTY_FORM;

function Tip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal-800 text-white text-xs rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50 w-max max-w-[200px] text-center leading-snug shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal-800" />
      </div>
    </div>
  );
}

export default function BlogManager() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogArticle | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [linkPopup, setLinkPopup] = useState(false);
  const [linkForm, setLinkForm] = useState({ texte: '', url: '', nom: '' });
  const linkCursorRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const [imagePopup, setImagePopup] = useState(false);
  const [imageForm, setImageForm] = useState({ alt: '', url: '' });
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);
  const imageCursorRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const [ctaPopup, setCtaPopup] = useState(false);
  const [ctaForm, setCtaForm] = useState({ texte: '', url: '' });
  const ctaCursorRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const { data } = await supabase
      .from('blog_articles')
      .select('*')
      .order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (article: BlogArticle) => {
    setForm({
      titre: article.titre,
      slug: article.slug,
      categorie: article.categorie,
      extrait: article.extrait,
      contenu: article.contenu,
      image_url: article.image_url || '',
      video_url: article.video_url || '',
      publie: article.publie,
    });
    setEditing(article);
    setCreating(false);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setMsg('');
  };

  const openLinkPopup = () => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.contenu.slice(start, end);
    linkCursorRef.current = { start, end };
    setLinkForm({ texte: selected, url: '', nom: '' });
    setLinkPopup(true);
  };

  const confirmInsertLink = () => {
    const ta = contentRef.current;
    if (!ta) return;
    const { start, end } = linkCursorRef.current;
    const scrollTop = ta.scrollTop;
    const texte = linkForm.texte || 'texte';
    const snippet = linkForm.nom
      ? `[${texte}](${linkForm.url} "${linkForm.nom}")`
      : `[${texte}](${linkForm.url})`;
    const next = form.contenu.slice(0, start) + snippet + form.contenu.slice(end);
    setForm((f) => ({ ...f, contenu: next }));
    setLinkPopup(false);
    requestAnimationFrame(() => {
      ta.focus();
      ta.scrollTop = scrollTop;
      ta.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  const openImagePopup = () => {
    const ta = contentRef.current;
    if (!ta) return;
    imageCursorRef.current = { start: ta.selectionStart, end: ta.selectionEnd };
    setImageForm({ alt: '', url: '' });
    setImagePopup(true);
  };

  const confirmInsertImage = () => {
    const ta = contentRef.current;
    if (!ta || !imageForm.url) return;
    const { start, end } = imageCursorRef.current;
    const scrollTop = ta.scrollTop;
    const snippet = `![${imageForm.alt}](${imageForm.url})`;
    const before = form.contenu.slice(0, start);
    const after = form.contenu.slice(end);
    const needsBefore = before.length > 0 && !before.endsWith('\n\n') ? '\n\n' : '';
    const needsAfter = after.length > 0 && !after.startsWith('\n\n') ? '\n\n' : '';
    const next = before + needsBefore + snippet + needsAfter + after;
    setForm((f) => ({ ...f, contenu: next }));
    setImagePopup(false);
    requestAnimationFrame(() => {
      ta.focus();
      ta.scrollTop = scrollTop;
      const pos = start + needsBefore.length + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const handleInlineImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMsg('Format image non supporté (jpg, png, webp)');
      return;
    }
    setUploadingInlineImage(true);
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `blog-images/${name}`;
    const { error } = await supabase.storage.from('service-images').upload(path, file);
    if (error) {
      setMsg(`Erreur upload : ${error.message}`);
    } else {
      const { data } = supabase.storage.from('service-images').getPublicUrl(path);
      setImageForm((f) => ({ ...f, url: data.publicUrl }));
    }
    setUploadingInlineImage(false);
    e.target.value = '';
  };

  const openCtaPopup = () => {
    const ta = contentRef.current;
    if (!ta) return;
    ctaCursorRef.current = { start: ta.selectionStart, end: ta.selectionEnd };
    setCtaForm({ texte: '', url: '' });
    setCtaPopup(true);
  };

  const confirmInsertCta = () => {
    const ta = contentRef.current;
    if (!ta || !ctaForm.texte || !ctaForm.url) return;
    const { start, end } = ctaCursorRef.current;
    const scrollTop = ta.scrollTop;
    const snippet = `[CTA: ${ctaForm.texte}](${ctaForm.url})`;
    const before = form.contenu.slice(0, start);
    const after = form.contenu.slice(end);
    const needsBefore = before.length > 0 && !before.endsWith('\n\n') ? '\n\n' : '';
    const needsAfter = after.length > 0 && !after.startsWith('\n\n') ? '\n\n' : '';
    const next = before + needsBefore + snippet + needsAfter + after;
    setForm((f) => ({ ...f, contenu: next }));
    setCtaPopup(false);
    requestAnimationFrame(() => {
      ta.focus();
      ta.scrollTop = scrollTop;
      const pos = start + needsBefore.length + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const insertFormat = (before: string, after: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const scrollTop = ta.scrollTop;
    const inner = form.contenu.slice(start, end) || 'texte';
    const snippet = before + inner + after;
    const next = form.contenu.slice(0, start) + snippet + form.contenu.slice(end);
    setForm((f) => ({ ...f, contenu: next }));
    requestAnimationFrame(() => {
      ta.focus();
      ta.scrollTop = scrollTop;
      ta.setSelectionRange(start + before.length, start + before.length + inner.length);
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const scrollTop = ta.scrollTop;
    const content = form.contenu;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const selectedText = content.slice(lineStart, end);
    const prefixed = selectedText
      .split('\n')
      .map((line) => (line.trim() ? prefix + line : line))
      .join('\n');
    const next = content.slice(0, lineStart) + prefixed + content.slice(end);
    setForm((f) => ({ ...f, contenu: next }));
    requestAnimationFrame(() => {
      ta.focus();
      ta.scrollTop = scrollTop;
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    });
  };

  const generateExtrait = () => {
    const first = form.contenu.split('\n\n')[0]?.trim() || '';
    if (!first) return;
    const MAX = 200;
    if (first.length <= MAX) {
      setForm((f) => ({ ...f, extrait: first }));
      return;
    }
    const cut = first.slice(0, MAX);
    const lastSentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
    const result = lastSentence > 80 ? cut.slice(0, lastSentence + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…';
    setForm((f) => ({ ...f, extrait: result }));
  };

  const uploadFile = async (
    file: File,
    folder: 'blog-images' | 'blog-videos',
    setUploading: (v: boolean) => void,
    field: 'image_url' | 'video_url'
  ) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${folder}/${name}`;
    const { error } = await supabase.storage.from('service-images').upload(path, file);
    if (error) {
      setMsg(`Erreur upload : ${error.message}`);
    } else {
      const { data } = supabase.storage.from('service-images').getPublicUrl(path);
      setForm((f) => ({ ...f, [field]: data.publicUrl }));
    }
    setUploading(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMsg('Format image non supporté (jpg, png, webp)');
      return;
    }
    uploadFile(file, 'blog-images', setUploadingImage, 'image_url');
    e.target.value = '';
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
      setMsg('Format vidéo non supporté (mp4, webm, ogg)');
      return;
    }
    uploadFile(file, 'blog-videos', setUploadingVideo, 'video_url');
    e.target.value = '';
  };

  const handleTitreChange = (titre: string) => {
    setForm((f) => ({
      ...f,
      titre,
      slug: editing ? f.slug : toSlug(titre),
    }));
  };

  const saveArticle = async () => {
    if (!form.titre || !form.slug || !form.extrait || !form.contenu) {
      setMsg('Remplissez tous les champs obligatoires.');
      return;
    }
    setSaving(true);
    setMsg('');

    const payload = {
      titre: form.titre,
      slug: form.slug,
      categorie: form.categorie,
      extrait: form.extrait,
      contenu: form.contenu,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      publie: form.publie,
      updated_at: new Date().toISOString(),
    };

    const { error } = editing
      ? await supabase.from('blog_articles').update(payload).eq('id', editing.id)
      : await supabase.from('blog_articles').insert(payload);

    if (error) {
      setMsg(`Erreur : ${error.message}`);
    } else {
      cancelForm();
      loadArticles();
      setMsg(editing ? 'Article mis à jour.' : 'Article créé.');
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(false);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;
    await supabase.from('blog_articles').delete().eq('id', id);
    loadArticles();
  };

  const togglePublish = async (article: BlogArticle) => {
    await supabase
      .from('blog_articles')
      .update({ publie: !article.publie, updated_at: new Date().toISOString() })
      .eq('id', article.id);
    loadArticles();
  };

  if (loading) return <div className="py-8 text-center text-charcoal-400">Chargement...</div>;

  if (creating || editing) {
    return (
      <>
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={cancelForm}
            className="flex items-center gap-1.5 text-charcoal-500 hover:text-charcoal-800 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h2 className="font-serif text-2xl text-charcoal-800">
            {editing ? "Modifier l'article" : 'Nouvel article'}
          </h2>
        </div>

        {msg && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              msg.startsWith('Erreur')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {msg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Titre *</label>
              <input
                type="text"
                value={form.titre}
                onChange={(e) => handleTitreChange(e.target.value)}
                placeholder="Titre de l'article"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-charcoal-600">Slug (URL) *</label>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, slug: toSlug(f.titre) }))}
                  disabled={!form.titre.trim()}
                  title="Générer depuis le titre"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Générer
                </button>
              </div>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="mon-article"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-1.5">
              Catégorie *
            </label>
            <select
              value={form.categorie}
              onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-charcoal-600">
                Extrait *{' '}
                <span className="text-charcoal-400 font-normal">(résumé affiché sur la liste)</span>
              </label>
              <button
                type="button"
                onClick={generateExtrait}
                disabled={!form.contenu.trim()}
                title="Générer depuis le contenu"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Générer
              </button>
            </div>
            <textarea
              value={form.extrait}
              onChange={(e) => setForm((f) => ({ ...f, extrait: e.target.value }))}
              rows={2}
              placeholder="Une brève description de l'article... ou cliquez sur Générer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 resize-none focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-2">
              Contenu *{' '}
              <span className="text-charcoal-400 font-normal">(double saut de ligne = paragraphe)</span>
            </label>

            <div className="flex items-center gap-1 mb-1.5 p-1.5 bg-gray-50 border border-gray-200 rounded-t-lg flex-wrap">
              {[
                { icon: <Bold className="w-3.5 h-3.5" />, tip: 'Gras — met le texte sélectionné en gras', action: () => insertFormat('**', '**') },
                { icon: <Italic className="w-3.5 h-3.5" />, tip: 'Italique — met le texte en oblique', action: () => insertFormat('*', '*') },
                { icon: <Underline className="w-3.5 h-3.5" />, tip: 'Souligné — ajoute un soulignement', action: () => insertFormat('__', '__') },
                { icon: <Strikethrough className="w-3.5 h-3.5" />, tip: 'Barré — trace un trait sur le texte', action: () => insertFormat('~~', '~~') },
              ].map(({ icon, tip, action }) => (
                <Tip key={tip} text={tip}>
                  <button type="button" onClick={action}
                    className="p-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-charcoal-900 transition-all"
                  >{icon}</button>
                </Tip>
              ))}
              <div className="w-px h-5 bg-gray-300 mx-1" />
              {[
                { icon: <Heading2 className="w-3.5 h-3.5" />, tip: 'Titre de section — grand titre visible dans l\'article', action: () => insertLinePrefix('## ') },
                { icon: <Heading3 className="w-3.5 h-3.5" />, tip: 'Sous-titre — titre de niveau secondaire', action: () => insertLinePrefix('### ') },
                { icon: <Quote className="w-3.5 h-3.5" />, tip: 'Citation — met la ligne en retrait avec un trait doré', action: () => insertLinePrefix('> ') },
                { icon: <List className="w-3.5 h-3.5" />, tip: 'Liste à puces — crée une liste avec tirets', action: () => insertLinePrefix('- ') },
              ].map(({ icon, tip, action }) => (
                <Tip key={tip} text={tip}>
                  <button type="button" onClick={action}
                    className="p-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-charcoal-900 transition-all"
                  >{icon}</button>
                </Tip>
              ))}
              <Tip text="Séparateur — trace un trait horizontal entre deux parties">
                <button type="button" onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const start = ta.selectionStart;
                  const scrollTop = ta.scrollTop;
                  const before = form.contenu.slice(0, start);
                  const after = form.contenu.slice(start);
                  const needsBefore = before.length > 0 && !before.endsWith('\n\n') ? '\n\n' : '';
                  const needsAfter = after.length > 0 && !after.startsWith('\n\n') ? '\n\n' : '';
                  const next = before + needsBefore + '---' + needsAfter + after;
                  setForm((f) => ({ ...f, contenu: next }));
                  requestAnimationFrame(() => {
                    ta.focus();
                    ta.scrollTop = scrollTop;
                    const pos = before.length + needsBefore.length + 3;
                    ta.setSelectionRange(pos, pos);
                  });
                }} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-charcoal-900 transition-all">
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </Tip>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <Tip text="FAQ accordéon — insère une question/réponse cliquable que le lecteur peut ouvrir">
                <button type="button" onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const start = ta.selectionStart;
                  const scrollTop = ta.scrollTop;
                  const snippet = `? Votre question ?\n! Votre réponse.`;
                  const before = form.contenu.slice(0, start);
                  const after = form.contenu.slice(start);
                  const needsBefore = before.length > 0 && !before.endsWith('\n\n') ? '\n\n' : '';
                  const needsAfter = after.length > 0 && !after.startsWith('\n\n') ? '\n\n' : '';
                  const next = before + needsBefore + snippet + needsAfter + after;
                  setForm((f) => ({ ...f, contenu: next }));
                  requestAnimationFrame(() => {
                    ta.focus();
                    ta.scrollTop = scrollTop;
                    const pos = before.length + needsBefore.length + 2;
                    ta.setSelectionRange(pos, pos + 'Votre question ?'.length);
                  });
                }} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-gold-600 transition-all">
                  <HelpCircle className="w-3.5 h-3.5" />FAQ
                </button>
              </Tip>
              <Tip text="Lien — crée un texte cliquable qui renvoie vers une page ou URL">
                <button type="button" onClick={openLinkPopup}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-gold-600 transition-all">
                  <Link2 className="w-3.5 h-3.5" />Lien
                </button>
              </Tip>
              <Tip text="Image — insère une photo dans le corps de l'article">
                <button type="button" onClick={openImagePopup}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-gold-600 transition-all">
                  <Image className="w-3.5 h-3.5" />Image
                </button>
              </Tip>
              <Tip text="Bouton d'action — insère un bouton doré avec lien (ex: Demander un devis)">
                <button type="button" onClick={openCtaPopup}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-charcoal-600 hover:text-gold-600 transition-all">
                  <Zap className="w-3.5 h-3.5" />CTA
                </button>
              </Tip>
            </div>

            <textarea
              ref={contentRef}
              value={form.contenu}
              onChange={(e) => setForm((f) => ({ ...f, contenu: e.target.value }))}
              rows={14}
              placeholder="Contenu complet de l'article..."
              className="w-full px-4 py-2.5 border border-gray-300 border-t-0 rounded-b-lg text-charcoal-700 resize-y focus:outline-none focus:border-gold-400 font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-charcoal-400">
              Liens : <code className="bg-gray-100 px-1 rounded">[texte affiché](url)</code>
              {' '}— ex : <code className="bg-gray-100 px-1 rounded">[notre traiteur](/service/traiteur-oriental)</code>
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Image</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://... ou uploader ci-contre"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {uploadingImage ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingImage ? 'Upload...' : 'Uploader'}
              </button>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="Traiteur oriental dans le Var" className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-200" />
            )}
          </div>

          {/* Vidéo */}
          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-1.5">
              Vidéo{' '}
              <span className="text-charcoal-400 font-normal">(YouTube ou fichier mp4/webm)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=... ou uploader"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {uploadingVideo ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingVideo ? 'Upload...' : 'Uploader'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="publie"
              checked={form.publie}
              onChange={(e) => setForm((f) => ({ ...f, publie: e.target.checked }))}
              className="w-4 h-4 accent-gold-500"
            />
            <label htmlFor="publie" className="text-sm font-medium text-charcoal-600 cursor-pointer">
              Publier l'article (visible sur le site)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={saveArticle}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : "Créer l'article"}
            </button>
            <button
              onClick={cancelForm}
              className="px-6 py-3 border border-gray-300 text-charcoal-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInlineImageFile}
        className="hidden"
      />

      {imagePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setImagePopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-charcoal-800">Insérer une image</h3>
              <button onClick={() => setImagePopup(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-charcoal-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">URL de l'image *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageForm.url}
                    onChange={(e) => setImageForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://... ou uploader ci-contre"
                    autoFocus
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                  />
                  <button
                    type="button"
                    onClick={() => inlineImageInputRef.current?.click()}
                    disabled={uploadingInlineImage}
                    className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-300 rounded-lg text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                  >
                    {uploadingInlineImage ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingInlineImage ? '...' : 'Upload'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Description <span className="text-charcoal-400 font-normal">(texte alternatif, SEO)</span></label>
                <input
                  type="text"
                  value={imageForm.alt}
                  onChange={(e) => setImageForm((f) => ({ ...f, alt: e.target.value }))}
                  placeholder="Ex : Décoration florale mariage oriental"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              {imageForm.url && (
                <img src={imageForm.url} alt={imageForm.alt} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
              )}
              {imageForm.url && (
                <p className="text-xs text-charcoal-400 bg-gray-50 rounded-lg px-3 py-2 font-mono">
                  {`![${imageForm.alt || 'description'}](${imageForm.url})`}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmInsertImage}
                disabled={!imageForm.url}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Image className="w-4 h-4" />
                Insérer
              </button>
              <button onClick={() => setImagePopup(false)} className="px-5 py-2.5 border border-gray-300 text-charcoal-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {ctaPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setCtaPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-charcoal-800">Insérer un call to action</h3>
              <button onClick={() => setCtaPopup(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-charcoal-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Texte du bouton *</label>
                <input
                  type="text"
                  value={ctaForm.texte}
                  onChange={(e) => setCtaForm((f) => ({ ...f, texte: e.target.value }))}
                  placeholder="Ex : Demander un devis gratuit"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">URL de destination *</label>
                <input
                  type="text"
                  value={ctaForm.url}
                  onChange={(e) => setCtaForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="Ex : /#contact ou /service/traiteur-oriental"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              {(ctaForm.texte || ctaForm.url) && (
                <p className="text-xs text-charcoal-400 bg-gray-50 rounded-lg px-3 py-2 font-mono">
                  {`[CTA: ${ctaForm.texte || 'texte'}](${ctaForm.url || 'url'})`}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmInsertCta}
                disabled={!ctaForm.texte || !ctaForm.url}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                Insérer
              </button>
              <button onClick={() => setCtaPopup(false)} className="px-5 py-2.5 border border-gray-300 text-charcoal-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {linkPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setLinkPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-charcoal-800">Insérer un lien</h3>
              <button
                onClick={() => setLinkPopup(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-charcoal-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">
                  Texte du lien *
                </label>
                <input
                  type="text"
                  value={linkForm.texte}
                  onChange={(e) => setLinkForm((f) => ({ ...f, texte: e.target.value }))}
                  placeholder="Ex : notre traiteur oriental"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">
                  URL *
                </label>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://... ou /service/traiteur-oriental"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-600 mb-1.5">
                  Nom / Titre <span className="text-charcoal-400 font-normal">(info-bulle, optionnel)</span>
                </label>
                <input
                  type="text"
                  value={linkForm.nom}
                  onChange={(e) => setLinkForm((f) => ({ ...f, nom: e.target.value }))}
                  placeholder="Ex : Voir notre page traiteur"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-charcoal-700 focus:outline-none focus:border-gold-400"
                />
              </div>
              {(linkForm.texte || linkForm.url) && (
                <p className="text-xs text-charcoal-400 bg-gray-50 rounded-lg px-3 py-2 font-mono">
                  {linkForm.nom
                    ? `[${linkForm.texte || 'texte'}](${linkForm.url || 'url'} "${linkForm.nom}")`
                    : `[${linkForm.texte || 'texte'}](${linkForm.url || 'url'})`}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmInsertLink}
                disabled={!linkForm.url}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Link2 className="w-4 h-4" />
                Insérer
              </button>
              <button
                onClick={() => setLinkPopup(false)}
                className="px-5 py-2.5 border border-gray-300 text-charcoal-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-charcoal-800">Articles du Blog</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded text-sm bg-green-50 text-green-700 border border-green-200">
          {msg}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Edit2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-charcoal-500">Aucun article. Créez votre premier article !</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt="Traiteur oriental dans le Var"
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gold-100 flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-gold-500 text-sm">SMS</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${article.publie ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="text-xs text-charcoal-400">
                      {article.publie ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="text-xs text-charcoal-300">·</span>
                    <span className="text-xs text-charcoal-400">{article.categorie}</span>
                  </div>
                  <p className="font-medium text-charcoal-800 truncate">{article.titre}</p>
                  <p className="text-sm text-charcoal-400 truncate">{article.extrait}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(article)}
                    title={article.publie ? 'Dépublier' : 'Publier'}
                    className={`p-2 rounded-lg transition-colors ${
                      article.publie
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {article.publie ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(article)}
                    title="Éditer"
                    className="p-2 rounded-lg text-charcoal-500 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Prévisualiser"
                    className="p-2 rounded-lg text-charcoal-500 hover:bg-blue-50 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    title="Supprimer"
                    className="p-2 rounded-lg text-charcoal-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
