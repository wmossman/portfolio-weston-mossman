import fs from 'fs';
import path from 'path';

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
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: any = {};
  let currentKey = '';
  frontMatterLines.forEach((line) => {
    if (/^\s+- /.test(line)) {
      // YAML array item
      if (currentKey) {
        metadata[currentKey] = metadata[currentKey] || [];
        metadata[currentKey].push(line.replace(/^\s+- /, '').trim());
      }
    } else {
      let [key, ...valueArr] = line.split(': ');
      let value = valueArr.join(': ').trim();
      value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
      metadata[key.trim()] = value;
      currentKey = key.trim();
    }
  });

  // After parsing, ensure tags is always an array if present
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
