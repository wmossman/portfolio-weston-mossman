import { render, screen } from '@testing-library/react';
import ProjectsPage from './page';

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ children }) => <div>{children}</div>,
}));

jest.mock('sugar-high', () => ({ highlight: (code) => code }));

describe('ProjectsPage', () => {
  it('renders projects', () => {
    // No need to pass projects prop, use the default MDX mock data
    render(<ProjectsPage />);
    expect(screen.getByText('Sample Project One')).toBeInTheDocument();
    expect(screen.getByText('Another Project')).toBeInTheDocument();
    expect(screen.getByText('More on the way!')).toBeInTheDocument();
  });
});