import { render, screen } from '@testing-library/react';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  it('should render as h1 heading with children text', () => {
    render(<PageTitle>Test Title</PageTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  it('should apply custom className when provided', () => {
    render(<PageTitle className="extra-class">Test Title</PageTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('extra-class');
  });
});
