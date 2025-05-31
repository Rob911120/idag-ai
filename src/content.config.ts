import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Enhanced schema for all content types with subdomain support
const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Transform string to Date object
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  hashtags: z.array(z.string()).default([]),
  author: z.string().default('idag.ai Redaktion'),
  readingTime: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  socialImage: z.string().optional(),
  relatedArticles: z.array(z.string()).optional(),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    publishedAt: z.coerce.date().optional()
  })).optional(),
  // New fields for subdomain targeting and cross-promotion
  subdomain: z.enum(['nyheter', 'modeller', 'verktyg', 'akademi']).optional(),
  crossPromote: z.array(z.object({
    title: z.string(),
    url: z.string(),
    subdomain: z.string()
  })).optional(),
  featured: z.boolean().default(false),
  priority: z.number().min(1).max(10).default(5),
  category: z.string().optional(),
  difficulty: z.enum(['nybörjare', 'medel', 'avancerad']).optional(),
  tags: z.array(z.string()).default([])
});

// News collection (existing)
const newsCollection = defineCollection({
  loader: glob({ base: "./src/content/news", pattern: "**/*.{md,mdx}" }),
  schema: contentSchema.extend({
    subdomain: z.literal('nyheter').default('nyheter')
  })
});

// New subdomain collections
const nyhetarCollection = defineCollection({
  loader: glob({ base: "./src/content/nyheter", pattern: "**/*.{md,mdx}" }),
  schema: contentSchema.extend({
    subdomain: z.literal('nyheter').default('nyheter'),
    newsType: z.enum(['breaking', 'analysis', 'opinion', 'interview']).optional()
  })
});

const modellerCollection = defineCollection({
  loader: glob({ base: "./src/content/modeller", pattern: "**/*.{md,mdx}" }),
  schema: contentSchema.extend({
    subdomain: z.literal('modeller').default('modeller'),
    modelType: z.enum(['llm', 'image', 'audio', 'video', 'multimodal']).optional(),
    provider: z.string().optional(),
    pricing: z.object({
      free: z.boolean().default(false),
      paid: z.boolean().default(false),
      enterprise: z.boolean().default(false)
    }).optional(),
    capabilities: z.array(z.string()).default([]),
    limitations: z.array(z.string()).default([])
  })
});

const verktygCollection = defineCollection({
  loader: glob({ base: "./src/content/verktyg", pattern: "**/*.{md,mdx}" }),
  schema: contentSchema.extend({
    subdomain: z.literal('verktyg').default('verktyg'),
    toolType: z.enum(['productivity', 'creative', 'development', 'analysis', 'automation']).optional(),
    platform: z.array(z.enum(['web', 'desktop', 'mobile', 'api'])).default(['web']),
    pricing: z.object({
      free: z.boolean().default(false),
      freemium: z.boolean().default(false),
      paid: z.boolean().default(false)
    }).optional(),
    features: z.array(z.string()).default([]),
    integrations: z.array(z.string()).default([])
  })
});

const akademiCollection = defineCollection({
  loader: glob({ base: "./src/content/akademi", pattern: "**/*.{md,mdx}" }),
  schema: contentSchema.extend({
    subdomain: z.literal('akademi').default('akademi'),
    courseType: z.enum(['tutorial', 'guide', 'course', 'workshop']).optional(),
    duration: z.string().optional(),
    prerequisites: z.array(z.string()).default([]),
    learningObjectives: z.array(z.string()).default([]),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['video', 'article', 'tool', 'dataset'])
    })).optional()
  })
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
  nyheter: nyhetarCollection,
  modeller: modellerCollection,
  verktyg: verktygCollection,
  akademi: akademiCollection,
  blog
};
