import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
}

export default function SEO({
  title = 'AI商标交易撮合平台',
  description = 'AI驱动的商标交易撮合平台，提供智能搜索、风险评估、安全交易服务',
  image = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  type = 'website',
  price,
  currency = 'CNY'
}: SEOProps) {
  const location = useLocation();
  const url = `https://trademark.exchange${location.pathname}`;
  const fullTitle = `${title} | AI商标交易`;

  useEffect(() => {
    document.title = fullTitle;
    
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        if (name) tag.setAttribute('name', name);
        if (property) tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: title,
      description,
      url,
      image,
      ...(type === 'product' && price && {
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: currency,
          availability: 'https://schema.org/InStock'
        }
      })
    };

    let scriptTag = document.querySelector('#json-ld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    return () => {
      const existingScript = document.querySelector('#json-ld');
      if (existingScript) existingScript.remove();
    };
  }, [fullTitle, description, image, url, type, price, currency]);

  return null;
}
