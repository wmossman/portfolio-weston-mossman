import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { getMDXData } from 'app/components/mdx-utils';
import Image from 'next/image';
import path from 'path';

export async function generateStaticParams() {
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = getMDXData(path.join(process.cwd(), 'app/projects/content'));
  const project = projects.find((p) => p.slug === params.slug);
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
          className="rounded mb-4 w-full h-64 object-cover"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{metadata.title}</h1>
      <div className="prose dark:prose-invert">
        <CustomMDX source={content} />
      </div>
    </main>
  );
}
