import { ReactNode } from 'react';

export interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export default function PageTitle({ children, className = '' }: PageTitleProps) {
  const baseClasses = 'mb-8 text-4xl font-semibold tracking-tighter text-text-heading';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <h1 className={combinedClasses}>{children}</h1>;
}
