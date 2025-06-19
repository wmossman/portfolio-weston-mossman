import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsPage from '../page';
import ProjectDetailPage from '../page';
import { projects } from '../../utils';
import '@testing-library/jest-dom';
import { useRouter, notFound } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  notFound: jest.fn(() => null),
}));

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ children }) => <div>{children}</div>,
}));

jest.mock('sugar-high', () => ({ highlight: (code) => code }));

// Mock the BackButton component
jest.mock('app/components/BackButton', () => {
  return function MockBackButton({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) {
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

describe('ProjectDetailPage', () => {
  it('renders project details for a valid slug', async () => {
    const ProjectComponent = await ProjectDetailPage({
      params: Promise.resolve({ slug: 'sample-project-1' }),
    });
    render(ProjectComponent);
    expect(screen.getByText('Sample Project 1')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByText('Back to projects')).toBeInTheDocument();
  });

  it('renders notFound for an invalid slug', async () => {
    const { notFound } = require('next/navigation');
    await ProjectDetailPage({
      params: Promise.resolve({ slug: 'non-existent' }),
    });
    expect(notFound).toHaveBeenCalled();
  });
});
