import { render, screen } from '@testing-library/react';
import ProjectsGrid from './components/ProjectsGrid';
import { Project } from './types';

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ children }) => <div>{children}</div>,
}));

jest.mock('sugar-high', () => ({ highlight: (code) => code }));

const mockProjects: Project[] = [
  {
    slug: 'sample-project-one',
    title: 'Sample Project One',
    tags: ['React', 'TypeScript'],
    summary: 'This is the first sample project for testing',
    image: '/images/projects/sample1.jpg',
    date: '2025-01-01'
  },
  {
    slug: 'another-project',
    title: 'Another Project',
    tags: ['Next.js', 'TailwindCSS'],
    summary: 'This is another project for testing purposes',
    image: '/images/projects/sample2.jpg',
    date: '2025-01-02'
  }
];

describe('ProjectsGrid', () => {
  it('renders projects', () => {
    render(<ProjectsGrid projects={mockProjects} />);
    
    expect(screen.getByText('Sample Project One')).toBeInTheDocument();
    expect(screen.getByText('Another Project')).toBeInTheDocument();
    expect(screen.getByText('More on the way!')).toBeInTheDocument();
  });
});