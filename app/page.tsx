import { BlogPosts } from 'app/components/posts';
import landingPageContent from 'app/content/landing-page-content';
import ImageWithFallback from 'app/components/ImageWithFallback';

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
      <h2 className="my-8 text-2xl">{landingPageContent.landingHook}</h2>
      <p className="mb-4">{landingPageContent.landingBlurb}</p>
      <a href="https://calendly.com/weston-limi/30min">
        <h2 className="my-8 text-2xl underline">{landingPageContent.landingCTA}</h2>
      </a>
    </section>
  );
}
