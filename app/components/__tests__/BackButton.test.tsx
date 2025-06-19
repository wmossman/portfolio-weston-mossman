import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackButton from '../BackButton';

describe('BackButton Component', () => {
  it('renders with default label', () => {
    render(<BackButton href="/projects" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveTextContent('Back to list');
  });

  it('renders with custom label', () => {
    render(<BackButton href="/devblog" label="Back to devblog" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/devblog');
    expect(link).toHaveTextContent('Back to devblog');
  });

  it('applies default styling classes', () => {
    render(<BackButton href="/projects" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-text-link');
    expect(link).toHaveClass('hover:text-accent-secondary');
    expect(link).toHaveClass('hover:underline');
    expect(link).toHaveClass('flex');
    expect(link).toHaveClass('items-center');
    expect(link).toHaveClass('gap-1');
    expect(link).toHaveClass('mb-6');
    expect(link).toHaveClass('transition-colors');
  });

  it('applies custom className', () => {
    render(<BackButton href="/projects" className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('contains left arrow caret', () => {
    render(<BackButton href="/projects" />);

    // Check that the arrow caret is present
    expect(screen.getByText('‹')).toBeInTheDocument();

    // Check aria-hidden attribute on the arrow
    const arrow = screen.getByText('‹');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('structures elements correctly', () => {
    render(<BackButton href="/projects" label="Back to projects" />);

    const link = screen.getByRole('link');
    const arrow = screen.getByText('‹');
    const text = screen.getByText('Back to projects');

    // Both arrow and text should be inside the link
    expect(link).toContainElement(arrow);
    expect(link).toContainElement(text);
  });
});
