// Project data model and loader for MDX content
import fs from 'fs';
import path from 'path';
import { getMDXData } from 'app/components/mdx-utils';

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  shortDescription: string;
  image: string;
};

// List of projects (CMS-ready, code-side for now)
export function getProjectData() {
  return getMDXData(path.join(process.cwd(), 'app/projects/content'));
}

export const projects: Project[] = getProjectData().map(p => ({
  slug: p.slug,
  title: p.metadata.title,
  tags: p.metadata.tags || [],
  shortDescription: p.metadata.summary || '',
  image: p.metadata.image,
}));
