import './global.css';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { Navbar } from './components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from './components/footer';
import { baseUrl } from './sitemap';

const monsterrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Weston Mossman's Portfolio",
    template: '%s | Weston Mossman Portfolio',
  },
  description: 'Welcome to my world.',
  openGraph: {
    title: "Weston Mossman's Portfolio",
    description: 'Welcome to my world.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/favicon/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/favicon/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/images/favicon/favicon-128.png', sizes: '128x128', type: 'image/png' },
      { url: '/images/favicon/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/images/favicon/favicon.ico',
    apple: [{ url: '/images/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(
        'text-text-primary bg-background-content dark:text-text-heading dark:bg-background-base antialiased',
        monsterrat.className,
      )}
    >
      <body className="antialiased max-w-5xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
