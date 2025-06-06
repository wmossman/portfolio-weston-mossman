import { getBlogPosts } from 'app/devblog/utils';

export const baseUrl = 'https://westonmossman.com';

// For static export compatibility
export const dynamic = 'force-static';

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/devblog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = ['', '/devblog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
