import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { getMDXData } from 'app/components/mdx-utils';
import Image from 'next/image';
import path from 'path';
import { Tag } from 'app/projects/components/Tag';

export function generateStaticParams() {
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  if (!project) return notFound();
  const { metadata, content } = project;
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {metadata.image && (
        <Image
          src={metadata.image}
          alt={metadata.title}
          width={800}
          height={400}
          className="rounded mb-4 w-full h-80 object-contain"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{metadata.title}</h1>
      {metadata.tags && metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {metadata.tags.map((tag: string) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
      <div className="prose dark:prose-invert">
        <CustomMDX source={content} />
      </div>
    </main>
  );
}
