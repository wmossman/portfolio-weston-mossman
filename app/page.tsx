'use client';

import { useState } from 'react';
import landingPageContent from 'app/content/landing-page-content';
import ImageWithFallback from 'app/components/ImageWithFallback';
import Button from 'app/components/Button';
import NetworkHero from 'app/components/NetworkHero';
import { NetworkHeroR3F } from 'app/components/NetworkHero/NetworkHeroR3F';

export default function Page() {
  const [useR3F, setUseR3F] = useState(true); // Default to R3F implementation

  return (
    <section>
      {/* Hero section with NetworkHero background and text overlay */}
      <div className="relative mb-8">
        {useR3F ? <NetworkHeroR3F /> : <NetworkHero />}

        {/* Toggle button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setUseR3F(!useR3F)}
            className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/40 transition-colors"
            type="button"
          >
            {useR3F ? 'Switch to Vanilla' : 'Switch to R3F'}
          </button>
        </div>

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
