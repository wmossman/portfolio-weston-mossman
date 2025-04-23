import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { formatDate, getBlogPosts } from 'app/blog/utils';
import { baseUrl } from 'app/sitemap';
import Link from 'next/link';

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props) {
  const { params } = await props;
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }) {
  let allBlogs = getBlogPosts();
  // Sort blogs by publishedAt descending (newest first)
  allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });
  let currentIndex = allBlogs.findIndex((p) => p.slug === params.slug);
  let prevPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
  let nextPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  let post = allBlogs[currentIndex];

  if (!post) {
    notFound();
  }

  return (
    <section>
      {/* Previous/Next navigation */}
      <div className="flex justify-between items-center mb-6">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className="text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1">
            <span aria-hidden="true">←</span> Previous
          </Link>
        ) : (
          <span className="text-neutral-400 flex items-center gap-1 cursor-not-allowed select-none">
            <span aria-hidden="true">←</span> Previous
          </span>
        )}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1">
            Next <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="text-neutral-400 flex items-center gap-1 cursor-not-allowed select-none">
            Next <span aria-hidden="true">→</span>
          </span>
        )}
      </div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
