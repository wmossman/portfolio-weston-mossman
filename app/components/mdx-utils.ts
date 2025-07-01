import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export type MDXMetadata = {
  title: string;
  publishedAt?: string;
  date?: string;
  summary?: string;
  tags?: string[];
  image?: string;
};

export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) return { metadata: {}, content: fileContent };
  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  let metadata: Record<string, unknown> = {};
  try {
    metadata = (yaml.load(frontMatterBlock) as Record<string, unknown>) || {};
  } catch {
    metadata = {};
  }
  // Always ensure tags is an array if present
  if (metadata.tags && !Array.isArray(metadata.tags)) {
    metadata.tags = [metadata.tags];
  }
  return { metadata, content };
}

export function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

export function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

export function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return {
      metadata,
      slug,
      content,
    };
  });
}
