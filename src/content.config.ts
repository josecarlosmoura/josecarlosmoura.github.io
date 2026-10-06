import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Série de posts (ex.: "Fundamentos de IA Aplicada") e ordem dentro da série
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    // Imagem de compartilhamento (caminho em /public). Se ausente, usa a padrão.
    cover: z.string().optional(),
    // Página HTML autônoma (em /public) para exibir dentro do artigo, ex.: /visuais/meu-guia.html
    embed: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
