import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPosts, topicOf } from '../lib/blog';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const posts = await getPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}/blog/${post.id}/`,
      categories: [topicOf(post).name, ...post.data.tags],
    })),
    customData: '<language>pt-br</language>',
  });
}
