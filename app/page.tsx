import { BlogPosts } from 'app/components/posts'
import landingPageContent from 'app/content/landing-page-content';

export default function Page() {
  return (
    <section>
      <img className="mb-8" src="/images/portfolio-photo.jpg" alt="Weston Mossman Portoflio Photo" width={500} height={500} />
      <h1 className="mb-8 text-4xl font-semibold tracking-tighter">
      {landingPageContent.myName}
      </h1>
      <p className="mb-4">
        {landingPageContent.landingBlurb}
      </p>
      <div className="my-8">
      <h2 className="text-xl">
        {landingPageContent.landingCTA}
      </h2>
      </div>
    </section>
  )
}
