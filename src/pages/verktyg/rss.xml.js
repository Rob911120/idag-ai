import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts.js';

export async function GET(context) {
  // Get all content from geo-based verktyg collections
  const seVerktygContent = await getCollection('se-verktyg');
  const noVerktygContent = await getCollection('no-verktyg');
  
  // Combine and sort by date
  const allContent = [...seVerktygContent, ...noVerktygContent];
  const sortedContent = allContent
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - AI-Verktyg`,
    description: 'Recensioner och guider för AI-verktyg inom produktivitet, kreativitet och utveckling',
    site: context.site,
    items: sortedContent.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author || 'idag.ai Redaktion',
      link: `/verktyg/${post.slug}/`,
      categories: post.data.hashtags || [],
    })),
    customData: `<language>sv-se</language>`,
  });
}