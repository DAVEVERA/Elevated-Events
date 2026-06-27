import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elevated-eventmaker.nl';
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/planner`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacyverklaring`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${siteUrl}/cookieverklaring`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${siteUrl}/algemene-voorwaarden`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${siteUrl}/verwerkersovereenkomst`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
