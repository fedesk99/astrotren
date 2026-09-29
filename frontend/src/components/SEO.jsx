import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  url,
  image = 'https://astrotren.vercel.app/Isologo-blanco-fondo-negro.png',
}) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector.includes('property=') ? selector.match(/property="([^"]+)"/)?.[1] : selector.match(/name="([^"]+)"/)?.[1]);
        document.head.appendChild(element);
      }

      element.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', description);

    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:image"]', 'property', image);

    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', image);

    let canonical = document.head.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
  }, [title, description, url, image]);

  return null;
};

export default SEO;