import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageWithFallback from '../ImageWithFallback';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage(props: Record<string, unknown>) {
    return <img {...props} />;
  };
});

describe('Image Display with Graceful Degradation', () => {
  describe('when users browse portfolio content with images', () => {
    it('should display the primary image when it loads successfully', () => {
      // Given: A user views content with a properly working image
      render(
        <ImageWithFallback
          src="/images/test-image.jpg"
          alt="Test project screenshot"
          width={400}
          height={300}
        />,
      );

      // When: The image loads without issues
      const image = screen.getByRole('img', {
        name: /test project screenshot/i,
      });

      // Then: Users should see the intended image
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/test-image.jpg');
    });

    it('should provide fallback image when primary image fails to load', () => {
      // Given: A user encounters content where the primary image is unavailable
      render(
        <ImageWithFallback
          src="/images/broken-image.jpg"
          alt="Project showcase"
          width={400}
          height={300}
        />,
      );

      const image = screen.getByRole('img', { name: /project showcase/i });

      // When: The primary image fails to load
      fireEvent.error(image);

      // Then: Users should see a fallback image instead of broken content
      expect(image).toHaveAttribute('src', '/images/portfolio-fallback.jpg');
    });

    it('should allow custom fallback image for different content contexts', () => {
      // Given: Content author specifies a custom fallback for specific context
      render(
        <ImageWithFallback
          src="/images/broken-image.jpg"
          fallbackSrc="/images/custom-fallback.jpg"
          alt="Custom content"
          width={400}
          height={300}
        />,
      );

      const image = screen.getByRole('img', { name: /custom content/i });

      // When: The primary image fails and custom fallback is specified
      fireEvent.error(image);

      // Then: Users should see the context-appropriate fallback image
      expect(image).toHaveAttribute('src', '/images/custom-fallback.jpg');
    });
  });
});
