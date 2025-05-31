import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts.js';

export async function GET(context) {
  // Get all content from nyheter and news collections
  const nyhetarContent = await getCollection('nyheter');
  const newsContent = await getCollection('news');
  
  // Combine and sort by date
  const allNewsContent = [...nyhetarContent, ...newsContent]
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