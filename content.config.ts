import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    ercs: defineCollection({
      source: 'ercs/ERCS/*.md',
      type: 'page',
      schema: z.object({
        eip: z.number(),
        title: z.string(),
        status: z.enum([
          'Living',
          'Final',
          'Last Call',
          'Review',
          'Draft',
          'Stagnant',
          'Withdrawn',
        ]),
        type: z.string(),
        created: z.string().date(),
        author: z.string(),
        requires: z.string().optional(),
      }),
    }),
  },
});
