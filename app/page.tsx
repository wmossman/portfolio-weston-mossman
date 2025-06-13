import { BlogPosts } from 'app/components/posts';
import landingPageContent from 'app/content/landing-page-content';
import ImageWithFallback from 'app/components/ImageWithFallback';
import Button from 'app/components/Button';

export default function Page() {
  return (
    <section>
      <ImageWithFallback
        className="mb-8"
        src="/images/portfolio-photo.jpg"
        alt="Weston Mossman Portoflio Photo"
        width={500}
        height={500}
      />
      <h2 className="my-8 text-2xl text-text-heading">{landingPageContent.landingHook}</h2>
      <p className="mb-4 text-text-primary">{landingPageContent.landingBlurb}</p>
      <Button
        url="https://calendly.com/weston-limi/30min"
        color="primary"
        size="lg"
        className="my-8"
      >
        {landingPageContent.landingCTA}
      </Button>
    </section>
  );
}
