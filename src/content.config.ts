import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const newsCollection = defineCollection({
  // Load Markdown and MDX files in the `src/content/news/` directory.
  loader: glob({ base: "./src/content/news", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    category: z.enum(['ai-nyheter', 'teknik', 'analys', 'trender', 'foretag']),
    tags: z.array(z.string()).optional(),
    hashtags: z.array(z.string()).optional(),
    author: z.string().default('idag.ai Redaktion'),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    socialImage: z.string().optional(),
    relatedArticles: z.array(z.string()).optional(),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      publishedAt: z.coerce.date().optional()
    })).optional()
  }),
});

// Keep the existing blog collection for backward compatibility
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { 
  news: newsCollection,
  blog 
};
