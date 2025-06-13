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
      <h2 className="my-8 text-2xl text-text-heading">{landingPageContent.landingHook}</h2>
      <p className="mb-4 text-text-primary">{landingPageContent.landingBlurb}</p>
      <a href="https://calendly.com/weston-limi/30min" className="cursor-pointer">
        <button className="my-8 px-6 py-3 text-xl bg-accent-primary text-background-base rounded-lg hover:bg-accent-secondary transition-colors font-medium cursor-pointer">
          {landingPageContent.landingCTA}
        </button>
      </a>
    </section>
  );
}
