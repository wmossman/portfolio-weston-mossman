import Link from 'next/link';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href, 
  label = "Back to list", 
  className = "" 
}: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className={`text-text-link hover:text-accent-secondary hover:underline flex items-center gap-1 mb-6 transition-colors ${className}`}
    >
      <span aria-hidden="true">‹</span>
      <span>{label}</span>
    </Link>
  );
}
