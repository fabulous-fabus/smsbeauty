import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, Trash2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

interface ServiceImage {
  id: string;
  service_id: string;
  image_url: string;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
}

const services: Service[] = [
  { id: 'traiteur-oriental', name: 'Traiteur Oriental' },
  { id: 'robes-soiree', name: 'Robes de Soirée' },
  { id: 'decoration-evenementielle', name: 'Décoration Événementielle' },
];

interface PhotoUploadPageProps {
  hideHeader?: boolean;
}

export default function PhotoUploadPage({ hideHeader = false }: PhotoUploadPageProps) {
  const [activeService, setActiveService] = useState<string>('traiteur-oriental');
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => { document.title = 'Gestion des Photos – Wedding by SMS'; }, []);

  useEffect(() => {
    loadImages();
  }, [activeService]);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_images')
      .select('*')
      .eq('service_id', activeService)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files) {
      await handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`${file.name} n'est pas un format supporté (jpg, png, webp)`);
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${activeService}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from('service-images')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('service_images')
          .insert({
            service_id: activeService,
            image_url: publicUrl.publicUrl,
          });

        if (insertError) throw insertError;

        loadImages();
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Erreur lors de l'upload de ${file.name}`);
      }
    }

    setUploading(false);
  };

  const deleteImage = async (image: ServiceImage) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo?')) return;

    setDeleteLoading(image.id);

    try {
      const fileName = image.image_url.split('/').pop();
      if (!fileName) throw new Error('Invalid file name');

      const { error: deleteStorageError } = await supabase.storage
        .from('service-images')
        .remove([`${activeService}/${fileName}`]);

      if (deleteStorageError) throw deleteStorageError;

      const { error: deleteDbError } = await supabase
        .from('service_images')
        .delete()
        .eq('id', image.id);

      if (deleteDbError) throw deleteDbError;

      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      {!hideHeader && (
        <SEOHead
          title="Gestion des Photos – Wedding by SMS"
          description="Espace de gestion des photos"
          noindex={true}
        />
      )}
      <div className={hideHeader ? 'bg-cream-50' : 'min-h-screen bg-cream-50'}>
        {!hideHeader && (
          <nav className="bg-charcoal-800 text-white px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-serif">Gestion des Photos</h1>
            <Link to="/admin" className="flex items-center gap-2 hover:text-gold-500">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </nav>
        )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Service Tabs */}
        <div className="flex gap-2 mb-8 border-b border-stone-200">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeService === service.id
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-charcoal-600 hover:text-charcoal-800'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-gold-500 bg-gold-50'
              : 'border-stone-300 bg-white hover:border-gold-400'
          }`}
        >
          <Upload className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-800 mb-2">
            Déposer les photos ici
          </h3>
          <p className="text-charcoal-500 mb-6">ou</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              disabled={uploading}
              className="hidden"
            />
            <span className="btn-gold inline-block cursor-pointer">
              {uploading ? 'Upload en cours...' : 'Choisir des fichiers'}
            </span>
          </label>
          <p className="text-charcoal-400 text-sm mt-4">
            Formats acceptés: JPG, PNG, WebP (max 5MB)
          </p>
        </div>

        {/* Images Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif text-charcoal-800 mb-8">
            Photos ({images.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-500">Aucune photo pour cette catégorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt="Service"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => deleteImage(image)}
                    disabled={deleteLoading === image.id}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {deleteLoading === image.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                  <p className="text-charcoal-500 text-xs mt-2">
                    {new Date(image.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
