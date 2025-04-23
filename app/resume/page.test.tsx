import { render, screen } from '@testing-library/react';
import ResumePage from './page';

describe('ResumePage', () => {
  it('renders the Resume title', () => {
    render(<ResumePage />);
    expect(screen.getByRole('heading', { name: /resume/i })).toBeInTheDocument();
  });

  it('renders the resume image', () => {
    render(<ResumePage />);
    const img = screen.getByAltText('Resume');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      'src',
      '/images/Weston Mossman Resume - Senior Full Stack Software Engineer & Creative Consultant.jpg'
    );
  });

  it('renders a download link for the PDF', () => {
    render(<ResumePage />);
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      '/pdf/Weston%20Mossman%20Resume%20-%20Senior%20Full%20Stack%20Software%20Engineer%20%26%20Creative%20Consultant.pdf'
    );
    expect(link).toHaveAttribute('download');
    expect(link.textContent).toMatch(/↓/);
  });
});
