import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export type MDXMetadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
  tags?: string[];
  image?: string;
};

export function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  if (!match) return { metadata: {}, content: fileContent };
  let frontMatterBlock = match[1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let metadata: any = {};
  try {
    metadata = yaml.load(frontMatterBlock) || {};
  } catch (e) {
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
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

export function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));
    return {
      metadata,
      slug,
      content,
    };
  });
}
