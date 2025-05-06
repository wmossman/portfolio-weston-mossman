import { parseFrontmatter } from './mdx-utils';

describe('parseFrontmatter', () => {
  it('extracts tags as an array from YAML frontmatter', () => {
    const mdx = `---\ntitle: Test Project\ntags:\n  - Climate\n  - Software\n  - Art\nimage: /images/test.jpg\n---\n# Test Project\nContent here.`;
    const { metadata } = parseFrontmatter(mdx);
    expect(metadata.title).toBe('Test Project');
    expect(metadata.image).toBe('/images/test.jpg');
    expect(Array.isArray(metadata.tags)).toBe(true);
    expect(metadata.tags).toEqual(['Climate', 'Software', 'Art']);
  });

  it('handles single tag as string', () => {
    const mdx = `---\ntitle: Test Project\ntags: Climate\n---\n# Test Project`;
    const { metadata } = parseFrontmatter(mdx);
    expect(Array.isArray(metadata.tags)).toBe(true);
    expect(metadata.tags).toEqual(['Climate']);
  });
});
