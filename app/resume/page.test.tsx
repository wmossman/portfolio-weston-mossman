import { render, screen } from '@testing-library/react';
import ResumePage from './page';

describe('Professional Resume Access', () => {
  describe('when visitors want to view professional credentials', () => {
    it('should display the resume page with clear identification', () => {
      // Given: A visitor navigates to the resume section
      render(<ResumePage />);

      // When: The page loads
      // Then: They should see clear identification of the resume content
      expect(screen.getByRole('heading', { name: /resume/i })).toBeInTheDocument();
    });

    // it('should provide downloadable PDF access for offline viewing', () => {
    //   // Given: A visitor wants to download the resume for offline use
    //   render(<ResumePage />);

    //   // When: They look for download options
    //   const downloadLink = screen.getByRole('link', { name: /download/i });

    //   // Then: A properly configured download link should be available
    //   expect(downloadLink).toBeInTheDocument();
    //   expect(downloadLink).toHaveAttribute(
    //     'href',
    //     '/pdf/Weston%20Mossman%20Resume%20-%20Senior%20Full%20Stack%20Software%20Engineer%20%26%20Creative%20Consultant.pdf',
    //   );
    //   expect(downloadLink).toHaveAttribute('download');
    //   expect(downloadLink.textContent).toMatch(/↓/);
    // });
  });
});
