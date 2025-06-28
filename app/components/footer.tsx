function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

const footerItems = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/westonmossman' },
  { label: 'GitHub', url: 'https://github.com/wmossman' },
  { label: 'Liminal', url: 'https://limi.space' },
  { label: 'Swayor Music', url: 'https://open.spotify.com/album/2Jnza2Gw0XMbHqy8C6RjyB' },
  { label: 'Email Me', url: 'mailto:weston@westonmossman.com' },
  { label: 'Schedule a Chat', url: 'https://calendly.com/westonmossman' },
];

export default function Footer() {
  return (
    <footer className="my-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-text-link md:flex-row md:space-x-4 md:space-y-0">
        {footerItems.map((footerItem) => (
          <li key={footerItem.url}>
            <a
              className="flex items-center transition-all hover:text-accent-secondary"
              rel="noopener noreferrer"
              target="_blank"
              href={footerItem.url}
            >
              <ArrowIcon />
              <p className="ml-2 h-7">{footerItem.label}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-text-primary">© {new Date().getFullYear()} Weston Mossman</p>
    </footer>
  );
}
