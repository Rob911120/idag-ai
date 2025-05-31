import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts.js';

export async function GET(context) {
  // Get all content from geo-based nyheter collections
  const seNyhetarContent = await getCollection('se-nyheter');
  const noNyhetarContent = await getCollection('no-nyheter');
  
  // Combine and sort by date
  const allNewsContent = [...seNyhetarContent, ...noNyhetarContent]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - Nyheter`,
    description: 'Senaste AI-nyheterna och utvecklingen inom artificiell intelligens',
    site: context.site,
    items: allNewsContent.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author || 'idag.ai Redaktion',
      link: `/nyheter/${post.slug}/`,
      categories: post.data.hashtags || [],
    })),
    customData: `<language>sv-se</language>`,
  });
}