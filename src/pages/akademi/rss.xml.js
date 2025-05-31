import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts.js';

export async function GET(context) {
  // Get all content from geo-based akademi collections
  const seAkademiContent = await getCollection('se-akademi');
  const noAkademiContent = await getCollection('no-akademi');
  
  // Combine and sort by date
  const allContent = [...seAkademiContent, ...noAkademiContent];
  const sortedContent = allContent
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - AI-Akademi`,
    description: 'Kurser, guider och tutorials inom AI, maskininlärning och prompt engineering',
    site: context.site,
    items: sortedContent.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author || 'idag.ai Redaktion',
      link: `/akademi/${post.slug}/`,
      categories: post.data.hashtags || [],
    })),
    customData: `<language>sv-se</language>`,
  });
}