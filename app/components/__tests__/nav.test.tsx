import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Navbar } from '../nav';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('Portfolio Site Navigation', () => {
  describe('when visitors want to navigate the portfolio', () => {
    it('should provide clear access to all main sections on desktop', () => {
      // Given: A visitor accesses the site on a desktop device
      render(<Navbar />);

      // When: They look for navigation options
      // Then: All main sections should be clearly accessible
      expect(screen.getByRole('link', { name: /devblog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
      
      // And the logo should link back to home
      const homeLink = screen.getByRole('link', { name: '' }); // Logo link has no text
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should enable mobile users to access navigation through menu toggle', async () => {
      // Given: A visitor accesses the site on a mobile device
      render(<Navbar />);
      const user = userEvent.setup();

      // When: They interact with the mobile menu button
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(menuButton);

      // Then: Menu should be marked as expanded and navigation options should become accessible
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByRole('link', { name: /devblog/i })).toHaveLength(2); // Desktop + mobile
      expect(screen.getAllByRole('link', { name: /projects/i })).toHaveLength(2); // Desktop + mobile  
      expect(screen.getAllByRole('link', { name: /resume/i })).toHaveLength(2); // Desktop + mobile
    });

    it('should allow mobile users to dismiss menu by clicking outside', async () => {
      // Given: A mobile visitor has opened the navigation menu
      render(<Navbar />);
      const user = userEvent.setup();

      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      await user.click(menuButton);
      
      // Verify menu is open
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // When: They click elsewhere on the page
      fireEvent.mouseDown(document.body);

      // Then: The menu should close automatically for better UX
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should support keyboard navigation for accessibility', async () => {
      // Given: A visitor using keyboard navigation opens the mobile menu
      render(<Navbar />);
      const user = userEvent.setup();

      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      await user.click(menuButton);

      // When: They press the Escape key
      await user.keyboard('{Escape}');

      // Then: The menu should close for accessible navigation
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should automatically close mobile menu when user selects a destination', async () => {
      // Given: A mobile visitor has opened the navigation menu
      render(<Navbar />);
      const user = userEvent.setup();

      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      await user.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // When: They click on a navigation link (find the mobile version)
      const allProjectsLinks = screen.getAllByRole('link', { name: /projects/i });
      const mobileProjectsLink = allProjectsLinks.find(link => 
        link.closest('.md\\:hidden')
      ) || allProjectsLinks[1]; // Fallback to second link which should be mobile
      
      await user.click(mobileProjectsLink);

      // Then: The menu should close automatically to avoid confusion
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should provide semantic navigation structure for screen readers', () => {
      // Given: A visitor using assistive technology accesses the site
      render(<Navbar />);

      // When: Screen reader software scans the page
      // Then: Navigation should be semantically structured
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle navigation menu');
    });
  });
});
