import landingPageContent from 'app/content/landing-page-content';
import Link from 'next/link';

const navItems = {
  '/blog': {
    name: 'blog',
  },
  '/projects': {
    name: 'projects',
  },
  '/resume': {
    name: 'resume',
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          {/* Name/title as a link to home, styled as on home page */}
          <Link
            href="/"
            className="text-4xl font-semibold tracking-tight mr-8 hover:opacity-80 transition"
          >
            {landingPageContent.myName}
          </Link>
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 text-lg font-medium"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
