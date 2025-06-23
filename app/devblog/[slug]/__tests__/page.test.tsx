// __tests__/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../page';

// Mock next/navigation's notFound at the top before imports that use it
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound');
  }),
}));

// Mock getBlogPosts and formatDate
jest.mock('../../utils', () => ({
  getBlogPosts: jest.fn(),
  formatDate: (date: string) => `Formatted: ${date}`,
}));

const mockPosts = [
  {
    slug: 'first-post',
    metadata: {
      title: 'First Post',
      publishedAt: '2025-04-17',
      summary: 'Summary of first post',
      image: '/images/portfolio-photo.jpg',
    },
    content: 'Hello from first post',
  },
  {
    slug: 'second-post',
    metadata: {
      title: 'Second Post',
      publishedAt: '2025-04-18',
      summary: 'Summary of second post',
      image: '',
    },
    content: 'Hello from second post',
  },
];

// Mock CustomMDX to just render the source
jest.mock('app/components/mdx', () => ({
  CustomMDX: ({ source }: { source: string }) => <div>{source}</div>,
}));

describe('Development Blog Reading Experience', () => {
  beforeEach(() => {
    require('../../utils').getBlogPosts.mockReturnValue([...mockPosts]);
  });

  describe('when readers want to explore development insights', () => {
    it('should display complete blog post with metadata for reader engagement', async () => {
      // Given: A reader clicks on a blog post to read development insights
      const BlogComponent = await Blog({
        params: Promise.resolve({ slug: 'first-post' }),
      });
      render(BlogComponent);

      // When: The blog post loads
      // Then: They should see the title, content, publication date, and navigation back
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Hello from first post')).toBeInTheDocument();
      expect(screen.getByText('Formatted: 2025-04-17')).toBeInTheDocument();
      expect(screen.getByText('Back to devblog')).toBeInTheDocument();
    });

    it('should enable chronological navigation through older blog posts', async () => {
      // Given: A reader is viewing the first (oldest) blog post
      const BlogComponent = await Blog({
        params: Promise.resolve({ slug: 'first-post' }),
      });
      render(BlogComponent);

      // When: They look for navigation to newer posts
      // Then: Previous should be unavailable, Next should lead to newer content
      expect(screen.getByText('Previous').closest('a')).toBeNull();
      const nextLink = screen.getByText('Next').closest('a');
      expect(nextLink).toHaveAttribute('href', '/devblog/second-post');
    });

    it('should enable chronological navigation through recent blog posts', async () => {
      // Given: A reader is viewing the most recent blog post
      const BlogComponent = await Blog({
        params: Promise.resolve({ slug: 'second-post' }),
      });
      render(BlogComponent);

      // When: They look for navigation to older posts
      // Then: Next should be unavailable, Previous should lead to older content
      expect(screen.getByText('Next').closest('a')).toBeNull();
      const prevLink = screen.getByText('Previous').closest('a');
      expect(prevLink).toHaveAttribute('href', '/devblog/first-post');
    });

    it('should handle gracefully when blog post does not exist', async () => {
      // Given: A reader tries to access a non-existent blog post URL
      const { notFound } = require('next/navigation');
      
      // When: They navigate to an invalid blog post slug
      // Then: The system should handle this gracefully with a 404 response
      await expect(() =>
        Blog({ params: Promise.resolve({ slug: 'non-existent' }) }),
      ).rejects.toThrow('notFound');
      expect(notFound).toHaveBeenCalled();
    });
  });
});
