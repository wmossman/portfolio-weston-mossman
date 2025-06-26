'use client';

import landingPageContent from './content/landing-page-content';
import ImageWithFallback from './components/image-with-fallback';
import Button from './components/button-component';
import { NetworkHeroR3F } from './components/network-hero/network-hero-r3f';

export default function Page() {
  return (
    <section>
      {/* Hero section with NetworkHero background and text overlay */}
      <div className="relative mb-8">
        <NetworkHeroR3F />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4">
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-text-heading opacity-95 mb-2 md:mb-4 tracking-wide text-shadow-hero"
              style={{
                transform: 'scaleY(0.97)',
              }}
            >
              Weston Mossman
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-text-primary opacity-80 max-w-4xl mx-auto text-shadow-subtitle">
              Building generative connections <br />
              via experiences and technology
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <ImageWithFallback
          className="mb-8 mt-8 rounded-full"
          src="/images/portfolio-photo.jpg"
          alt="Weston Mossman Portoflio Photo"
          width={500}
          height={500}
        />
        <h2 className="my-8 text-2xl text-text-heading">
          {landingPageContent.landingHook}
        </h2>
        <p className="mb-4 text-text-primary">
          {landingPageContent.landingBlurb}
        </p>
        <Button
          url="https://calendly.com/weston-limi/30min"
          color="primary"
          size="lg"
          className="my-8"
        >
          {landingPageContent.landingCTA}
        </Button>
      </div>
    </section>
  );
}
