import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard, MoreComingCard } from '../project-card';
import { Project } from '../../utils';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock ImageWithFallback component
jest.mock('app/components/image-with-fallback', () => {
  return function MockImageWithFallback(props: Record<string, unknown>) {
    return <img {...props} />;
  };
});

// Mock Tag component
jest.mock('../tag-component', () => {
  return {
    Tag: function MockTag({ tag }: { tag: string }) {
      return <span data-testid={`tag-${tag}`}>{tag}</span>;
    },
  };
});

const mockProject: Project = {
  slug: 'amazing-portfolio-project',
  title: 'Amazing Portfolio Project',
  tags: ['React', 'TypeScript', 'Design'],
  summary:
    'A comprehensive project showcasing modern web development techniques and creative problem solving.',
  image: '/images/projects/amazing-project.jpg',
  date: '2025-01-15',
};

describe('Project Portfolio Browsing Experience', () => {
  describe('when visitors explore individual projects in the portfolio', () => {
    it('should display comprehensive project information for user evaluation', () => {
      // Given: A visitor browses the projects portfolio
      render(<ProjectCard project={mockProject} />);

      // When: They see a project card
      // Then: All essential project information should be clearly presented
      expect(
        screen.getByRole('heading', { name: /amazing portfolio project/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/comprehensive project showcasing/i),
      ).toBeInTheDocument();

      // Project image should be accessible
      const projectImage = screen.getByRole('img', {
        name: /amazing portfolio project/i,
      });
      expect(projectImage).toHaveAttribute(
        'src',
        '/images/projects/amazing-project.jpg',
      );

      // Technology tags should be visible
      expect(screen.getByTestId('tag-React')).toBeInTheDocument();
      expect(screen.getByTestId('tag-TypeScript')).toBeInTheDocument();
      expect(screen.getByTestId('tag-Design')).toBeInTheDocument();
    });

    it('should enable navigation to detailed project view when clicked', async () => {
      // Given: A visitor wants to learn more about a specific project
      render(<ProjectCard project={mockProject} />);

      // When: They click on the project card
      const projectLink = screen.getByRole('link');

      // Then: They should be able to navigate to the detailed project page
      expect(projectLink).toHaveAttribute(
        'href',
        '/projects/amazing-portfolio-project',
      );
    });

    it('should support custom interaction handling for non-navigation use cases', async () => {
      // Given: Project cards are used in a context requiring custom interaction
      const mockOnClick = jest.fn();
      render(
        <ProjectCard
          project={mockProject}
          onClick={mockOnClick}
          asLink={false}
        />,
      );

      // When: A visitor clicks the project card
      const projectCard = screen.getByTestId(
        'project-card-amazing-portfolio-project',
      );
      fireEvent.click(projectCard);

      // Then: The custom interaction should be triggered
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should encourage future engagement with upcoming projects teaser', () => {
      // Given: A visitor has browsed through all available projects
      render(<MoreComingCard />);

      // When: They encounter the "more coming" card
      // Then: They should see encouraging messaging about future content
      expect(
        screen.getByRole('heading', { name: /more on the way/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: /more coming soon/i }),
      ).toBeInTheDocument();
    });

    it('should maintain consistent visual structure across all project cards', () => {
      // Given: Multiple projects are displayed in the portfolio
      render(<ProjectCard project={mockProject} />);

      // When: The layout renders
      // Then: Key structural elements should be present for consistent user experience
      const projectCard = screen.getByTestId(
        'project-card-amazing-portfolio-project',
      );
      expect(projectCard).toBeInTheDocument();

      // Essential content areas should be structured consistently
      expect(screen.getByRole('heading')).toBeInTheDocument(); // Title
      expect(screen.getByRole('img')).toBeInTheDocument(); // Image
      expect(screen.getByText(/comprehensive project/i)).toBeInTheDocument(); // Summary
    });
  });
});
