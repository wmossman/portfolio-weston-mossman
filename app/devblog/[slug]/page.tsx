import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/MDX';
import { formatDate, getBlogPosts } from 'app/devblog/utils';
import { baseUrl } from 'app/sitemap';
import Link from 'next/link';
import BackButton from 'app/components/BackButton';

export function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const posts = getBlogPosts();
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  // Use image if provided, otherwise use portfolio photo as default
  const ogImage = image ? image : `${baseUrl}/images/portfolio-photo.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/devblog/${post.slug}`,
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

export default async function Blog({ params }: { params: Params }) {
  const resolvedParams = await params;
  const allBlogs = getBlogPosts();
  // Sort blogs by publishedAt descending (newest first)
  allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });
  const currentIndex = allBlogs.findIndex(
    (p) => p.slug === resolvedParams.slug,
  );
  const prevPost =
    currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const post = allBlogs[currentIndex];

  if (!post) {
    notFound();
  }

  return (
    <section>
      <BackButton href="/devblog" label="Back to devblog" />

      {/* Previous/Next navigation */}
      <div className="flex justify-between items-center mb-6">
        {prevPost ? (
          <Link
            href={`/devblog/${prevPost.slug}`}
            className="text-text-link hover:text-accent-secondary flex items-center gap-1"
          >
            <span aria-hidden="true">←</span> Previous
          </Link>
        ) : (
          <span className="text-text-link/50 flex items-center gap-1 cursor-default select-none">
            <span aria-hidden="true">←</span> Previous
          </span>
        )}
        {nextPost ? (
          <Link
            href={`/devblog/${nextPost.slug}`}
            className="text-text-link hover:text-accent-secondary flex items-center gap-1"
          >
            Next <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="text-text-link/50 flex items-center gap-1 cursor-default select-none">
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
              : `${baseUrl}/images/portfolio-photo.jpg`,
            url: `${baseUrl}/devblog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter text-[color:var(--color-text-heading)]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-[color:var(--color-text-link)]">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose text-[color:var(--color-text-primary)]">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
