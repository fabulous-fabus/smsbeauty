import { Helmet } from 'react-helmet-async';

interface RichSnippetProps {
  type: 'LocalBusiness' | 'Article' | 'Service' | 'CollectionPage';
  data: Record<string, any>;
}

export default function RichSnippets({ type, data }: RichSnippetProps) {
  const getSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'LocalBusiness':
        return {
          ...baseSchema,
          name: 'Wedding by SMS',
          description: data.description || 'Traiteur oriental, robes de soirée et décoration événementielle à Hyères',
          url: 'https://weddingbysms.fr',
          telephone: data.telephone || '+33 6 XX XX XX XX',
          email: data.email || 'contact@weddingbysms.fr',
          image: 'https://weddingbysms.fr/tajine.jpg',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.streetAddress || '',
            addressLocality: 'Hyères',
            postalCode: '83400',
            addressCountry: 'FR',
          },
          areaServed: ['Hyères', 'Toulon', 'Var', 'France'],
          sameAs: data.sameAs || [],
          priceRange: data.priceRange || '$$',
        };

      case 'Article':
        return {
          ...baseSchema,
          headline: data.headline,
          description: data.description,
          image: data.image || 'https://weddingbysms.fr/tajine.jpg',
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          author: {
            '@type': 'Organization',
            name: 'Wedding by SMS',
            url: 'https://weddingbysms.fr',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Wedding by SMS',
            logo: {
              '@type': 'ImageObject',
              url: 'https://weddingbysms.fr/tajine.jpg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url,
          },
        };

      case 'Service':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image || 'https://weddingbysms.fr/tajine.jpg',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Wedding by SMS',
            url: 'https://weddingbysms.fr',
          },
          areaServed: 'Hyères, Var, France',
          priceRange: data.priceRange || '$$',
          serviceType: data.serviceType,
          ...(data.offers && { offers: data.offers }),
        };

      case 'CollectionPage':
        return {
          ...baseSchema,
          name: 'Blog – Wedding by SMS',
          description: 'Articles et conseils pour mariage, décoration, traiteur oriental et robes de soirée',
          url: 'https://weddingbysms.fr/blog',
          publisher: {
            '@type': 'Organization',
            name: 'Wedding by SMS',
            url: 'https://weddingbysms.fr',
          },
        };

      default:
        return baseSchema;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getSchema())}
      </script>
    </Helmet>
  );
}
