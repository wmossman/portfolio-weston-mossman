// __tests__/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../page';

// Mock next/navigation's notFound at the top before imports that use it
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('notFound'); }),
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

describe('Blog page', () => {
  beforeEach(() => {
    require('../../utils').getBlogPosts.mockReturnValue([...mockPosts]);
  });

  it('renders MDX content and title', async () => {
    const BlogComponent = await Blog({ params: Promise.resolve({ slug: 'first-post' }) });
    render(BlogComponent);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Hello from first post')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2025-04-17')).toBeInTheDocument();
    expect(screen.getByText('Back to devblog')).toBeInTheDocument();
  });

  it('for old post shows navigation buttons and they link to correct posts', async () => {
    const BlogComponent = await Blog({ params: Promise.resolve({ slug: 'first-post' }) });
    render(BlogComponent);
    // Previous should be disabled, Next should link to second-post
    expect(screen.getByText('Previous').closest('a')).toBeNull();
    const nextLink = screen.getByText('Next').closest('a');
    expect(nextLink).toHaveAttribute('href', '/devblog/second-post');
  });

  it('for recent post shows navigation buttons and they link to correct posts', async () => {
    const BlogComponent = await Blog({ params: Promise.resolve({ slug: 'second-post' }) });
    render(BlogComponent);
    // Next should be disabled, Previous should link to first-post
    expect(screen.getByText('Next').closest('a')).toBeNull();
    const prevLink = screen.getByText('Previous').closest('a');
    expect(prevLink).toHaveAttribute('href', '/devblog/first-post');
  });

  it('renders notFound if post does not exist', async () => {
    const { notFound } = require('next/navigation');
    await expect(() => Blog({ params: Promise.resolve({ slug: 'non-existent' }) })).rejects.toThrow('notFound');
    expect(notFound).toHaveBeenCalled();
  });
});
