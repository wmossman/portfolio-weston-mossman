import { baseUrl } from 'app/sitemap';

// For static export compatibility
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      // Allow legitimate search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
      },

      // Block AI crawlers and training bots
      {
        userAgent: 'GPTBot', // OpenAI GPT
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // OpenAI ChatGPT plugins
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended', // Google AI (Bard, Vertex AI)
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl (used by many AI trainers)
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot', // Anthropic Claude
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web', // Anthropic Claude web version
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Anthropic AI
        disallow: '/',
      },
      {
        userAgent: 'Amazonbot', // Amazon AI
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot', // Meta/Facebook AI
        disallow: '/',
      },
      {
        userAgent: 'Meta-ExternalAgent', // Meta AI
        disallow: '/',
      },
      {
        userAgent: 'Meta-ExternalFetcher', // Meta AI fetcher
        disallow: '/',
      },
      {
        userAgent: 'Applebot', // Apple AI
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended', // Apple AI extended
        disallow: '/',
      },
      {
        userAgent: 'Bytespider', // TikTok/ByteDance AI
        disallow: '/',
      },
      {
        userAgent: 'Diffbot', // Diffbot AI
        disallow: '/',
      },
      {
        userAgent: 'ImagesiftBot', // Image AI bot
        disallow: '/',
      },
      {
        userAgent: 'Omgili', // Omgili AI
        disallow: '/',
      },
      {
        userAgent: 'Omgilibot', // Omgili AI bot
        disallow: '/',
      },
      {
        userAgent: 'YouBot', // You.com AI
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai', // Cohere AI
        disallow: '/',
      },
      {
        userAgent: 'Timpibot', // Timpi AI
        disallow: '/',
      },

      // Default rule for any other bots not explicitly allowed
      {
        userAgent: '*',
        disallow: '',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
