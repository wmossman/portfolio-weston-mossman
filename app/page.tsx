import { BlogPosts } from 'app/components/posts';
import landingPageContent from 'app/content/landing-page-content';

export default function Page() {
  return (
    <section>
      <img
        className="mb-8"
        src="/images/portfolio-photo.jpg"
        alt="Weston Mossman Portoflio Photo"
        width={500}
        height={500}
      />
      <h2 className="my-8 text-2xl">{landingPageContent.landingHook}</h2>
      <p className="mb-4">{landingPageContent.landingBlurb}</p>
      <h2 className="my-8 text-2xl">{landingPageContent.landingCTA}</h2>
    </section>
  );
}
