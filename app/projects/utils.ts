// Project data model and loader for MDX content
import fs from 'fs';
import path from 'path';
import { getMDXData } from 'app/components/mdx-utils';

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  summary: string;
  image: string;
  date: string;
};

// List of projects (CMS-ready, code-side for now)
export function getProjectData() {
  return getMDXData(path.join(process.cwd(), 'app/projects/content'));
}

export const projects: Project[] = getProjectData().map(p => ({
  slug: p.slug,
  title: p.metadata.title,
  tags: p.metadata.tags || [],
  summary: p.metadata.summary || '',
  image: p.metadata.image,
  date: p.metadata.date,
})).sort((a, b) => {
  const dateA = a.date ? new Date(a.date) : new Date(0);
  const dateB = b.date ? new Date(b.date) : new Date(0);
  return dateB.getTime() - dateA.getTime();
});
