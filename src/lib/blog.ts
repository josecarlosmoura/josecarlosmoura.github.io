import { getCollection, type CollectionEntry } from 'astro:content';
import { TOPICS } from '../consts';

export type Post = CollectionEntry<'blog'>;

// O assunto de um artigo é o nome da pasta: src/content/blog/<assunto>/<artigo>.md
export const topicSlugOf = (post: Post) => post.id.split('/')[0];
export const topicOf = (post: Post) => TOPICS.find((t) => t.slug === topicSlugOf(post))!;

/** Todos os artigos publicados (sem rascunhos), do mais novo para o mais antigo. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  for (const p of posts) {
    const [topic, ...rest] = p.id.split('/');
    if (rest.length === 0) {
      throw new Error(
        `O artigo "${p.id}" precisa ficar dentro de uma pasta de assunto, ex.: src/content/blog/ia-aplicada/${p.id}.md`,
      );
    }
    if (!TOPICS.some((t) => t.slug === topic)) {
      throw new Error(
        `Assunto desconhecido "${topic}" (artigo "${p.id}"). Cadastre o assunto em TOPICS (src/consts.ts) ou mova o arquivo para outra pasta.`,
      );
    }
  }

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Assuntos que já têm pelo menos um artigo publicado, na ordem definida em TOPICS. */
export async function getTopicsWithPosts() {
  const posts = await getPosts();
  return TOPICS.map((t) => ({ ...t, posts: posts.filter((p) => topicSlugOf(p) === t.slug) })).filter(
    (t) => t.posts.length > 0,
  );
}
