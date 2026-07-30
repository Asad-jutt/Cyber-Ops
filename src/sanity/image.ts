import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    return builder.image(source).auto('format').url() || '';
  } catch (err) {
    if (source?.asset?.url) return source.asset.url;
    return '';
  }
}
