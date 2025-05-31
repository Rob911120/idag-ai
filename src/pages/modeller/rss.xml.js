import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts.js';

export async function GET(context) {
  // Get all content from geo-based modeller collections
  const seModellerContent = await getCollection('se-modeller');
  const noModellerContent = await getCollection('no-modeller');
  
  // Combine and sort by date
  const allContent = [...seModellerContent, ...noModellerContent];
  const sortedContent = allContent
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - AI-Modeller`,
    description: 'Guider, recensioner och jämförelser av AI-modeller som ChatGPT, Claude, Gemini och fler',
    site: context.site,
    items: sortedContent.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author || 'idag.ai Redaktion',
      link: `/modeller/${post.slug}/`,
      categories: post.data.hashtags || [],
    })),
    customData: `<language>sv-se</language>`,
  });
}