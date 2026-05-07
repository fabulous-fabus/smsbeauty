import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  noindex?: boolean;
  keywords?: string;
}

const SITE_NAME = 'Wedding by SMS';
const DEFAULT_IMAGE = '/20240711_151936.jpg';
const SITE_URL = 'https://weddingbysms.fr';

export default function SEOHead({
  title,
  description,
  url = SITE_URL,
  image = DEFAULT_IMAGE,
  noindex = false,
  keywords,
}: SEOHeadProps) {
  const fullTitle = title.toLowerCase().includes('wedding by sms') ? title : `${title} – Wedding by SMS`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
