import { render, screen } from '@testing-library/react';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  it('renders title text correctly', () => {
    render(<PageTitle>Test Title</PageTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
  });

  it('applies base classes correctly', () => {
    render(<PageTitle>Test Title</PageTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('mb-8', 'text-4xl', 'font-semibold', 'tracking-tighter', 'text-text-heading');
  });

  it('applies additional classes when provided', () => {
    render(<PageTitle className="extra-class">Test Title</PageTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('extra-class');
  });

  it('has consistent container spacing', () => {
    render(<PageTitle>Test Title</PageTitle>);
    const container = screen.getByRole('heading', { level: 1 }).parentElement;
    expect(container).toHaveClass('mb-8');
  });
});
