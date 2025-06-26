import { notFound } from 'next/navigation';
import { CustomMDX } from '../../components/mdx';
import { getMDXData, type MDXMetadata } from '../../components/mdx-utils';
import path from 'path';
import { Tag } from '../components/tag-component';
import ImageWithFallback from '../../components/image-with-fallback';
import BackButton from '../../components/back-button';

export function generateStaticParams() {
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await params;
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  if (!project) return notFound();

  const { metadata, content } = project;
  // Type assertion to ensure metadata has the expected project properties
  const projectMetadata = metadata as MDXMetadata;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <BackButton href="/projects" label="Back to projects" />

      {projectMetadata.image && (
        <ImageWithFallback
          src={projectMetadata.image}
          alt={projectMetadata.title || 'Project image'}
          width={800}
          height={400}
          className="rounded mb-4 w-full h-80 object-contain"
        />
      )}
      <h1 className="text-3xl font-bold mb-4 text-[color:var(--color-text-heading)]">
        {projectMetadata.title || 'Untitled Project'}
      </h1>
      {projectMetadata.tags && projectMetadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {projectMetadata.tags.map((tag: string) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
      <div className="prose dark:prose-invert text-[color:var(--color-text-primary)]">
        <CustomMDX source={content} />
      </div>
    </main>
  );
}
