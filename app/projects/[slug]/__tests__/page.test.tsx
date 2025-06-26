import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '../page';
import '@testing-library/jest-dom';
import { notFound } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  notFound: jest.fn(() => null),
}));

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ children }) => <div>{children}</div>,
}));

jest.mock('sugar-high', () => ({ highlight: (code) => code }));

// Mock the BackButton component
jest.mock('app/components/back-button', () => {
  return function MockBackButton({ _href, label }: { _href: string; label: string }) {
    return <div data-testid="back-button">{label}</div>;
  };
});

jest.mock('app/components/mdx-utils', () => ({
  getMDXData: jest.fn(() => [
    {
      slug: 'sample-project-1',
      metadata: {
        title: 'Sample Project 1',
        tags: ['tag1'],
        description: 'desc',
      },
      content: 'Sample content',
    },
    {
      slug: 'sample-project-2',
      metadata: {
        title: 'Sample Project 2',
        tags: ['tag2'],
        description: 'desc',
      },
      content: 'Sample content',
    },
  ]),
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
}));

describe('Individual Project Exploration', () => {
  describe('when visitors want to explore a specific project in detail', () => {
    it('should display comprehensive project information when project exists', async () => {
      // Given: A visitor clicks on a specific project from the portfolio
      const ProjectComponent = await ProjectDetailPage({
        params: Promise.resolve({ slug: 'sample-project-1' }),
      });
      render(ProjectComponent);

      // When: The project detail page loads
      // Then: They should see the project title and navigation back to portfolio
      expect(screen.getByText('Sample Project 1')).toBeInTheDocument();
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByText('Back to projects')).toBeInTheDocument();
    });

    it('should handle gracefully when project does not exist', async () => {
      // Given: A visitor tries to access a non-existent project URL

      // When: They navigate to an invalid project slug
      await ProjectDetailPage({
        params: Promise.resolve({ slug: 'non-existent' }),
      });

      // Then: The system should handle this gracefully with a 404 response
      expect(notFound).toHaveBeenCalled();
    });
  });
});
