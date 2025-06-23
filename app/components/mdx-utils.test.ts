import { parseFrontmatter } from './mdx-utils';

describe('Content Management System', () => {
  describe('when content authors create project pages with metadata', () => {
    it('should extract project information from frontmatter to display correctly', () => {
      // Given: A content author creates a project page with YAML frontmatter
      const projectContent = `---\ntitle: Test Project\ntags:\n  - Climate\n  - Software\n  - Art\nimage: /images/test.jpg\n---\n# Test Project\nContent here.`;
      
      // When: The system processes the content for display
      const { metadata } = parseFrontmatter(projectContent);
      
      // Then: Project information should be properly extracted for user viewing
      expect(metadata.title).toBe('Test Project');
      expect(metadata.image).toBe('/images/test.jpg');
      expect(Array.isArray(metadata.tags)).toBe(true);
      expect(metadata.tags).toEqual(['Climate', 'Software', 'Art']);
    });

    it('should handle simplified tag format for content author convenience', () => {
      // Given: A content author uses a single tag format for simplicity
      const projectContent = `---\ntitle: Test Project\ntags: Climate\n---\n# Test Project`;
      
      // When: The system processes the simplified tag format
      const { metadata } = parseFrontmatter(projectContent);
      
      // Then: Tags should be normalized to array format for consistent display
      expect(Array.isArray(metadata.tags)).toBe(true);
      expect(metadata.tags).toEqual(['Climate']);
    });
  });
});
