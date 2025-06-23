import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackButton from '../BackButton';

describe('BackButton Component', () => {
  it('should render a navigation link with default "Back to list" text', () => {
    render(<BackButton href="/projects" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveTextContent('Back to list');
  });

  it('should render with custom label when provided', () => {
    render(<BackButton href="/devblog" label="Back to devblog" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/devblog');
    expect(link).toHaveTextContent('Back to devblog');
  });

  it('should apply custom className when provided', () => {
    render(<BackButton href="/projects" className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('should include accessible navigation arrow', () => {
    render(<BackButton href="/projects" />);

    const arrow = screen.getByText('‹');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });
});
