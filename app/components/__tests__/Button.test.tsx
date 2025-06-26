import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../button-component';

describe('Button Component', () => {
  it('should render as a button with children when no URL is provided', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('should render as a link with children when URL is provided', () => {
    render(<Button url="https://example.com">Test Link</Button>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Test Link');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should apply custom className when provided', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should include download attribute for file downloads', () => {
    render(
      <Button url="/file.pdf" download>
        Download PDF
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('download');
  });

  it('should include target and rel attributes for external links', () => {
    render(
      <Button
        url="https://external.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        External Link
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
