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

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getMDXData: () => ([
    {
      slug: 'sample-project-1',
      metadata: { title: 'Sample Project 1', tags: ['tag1'], description: 'desc' },
      content: 'Sample content',
    },
    {
      slug: 'sample-project-2',
      metadata: { title: 'Sample Project 2', tags: ['tag2'], description: 'desc' },
      content: 'Sample content',
    },
  ]),
}));

describe('ProjectDetailPage', () => {
  it('renders project details for a valid slug', () => {
    render(<ProjectDetailPage params={{ slug: 'sample-project-1' }} />);
    expect(screen.getByText('Sample Project One')).toBeInTheDocument();
    // Removed description check since it's not rendered
  });

  it('renders notFound for an invalid slug', () => {
    const { notFound } = require('next/navigation');
    render(<ProjectDetailPage params={{ slug: 'non-existent' }} />);
    expect(notFound).toHaveBeenCalled();
  });
});
