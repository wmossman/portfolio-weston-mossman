import React, { ReactNode } from 'react';

// Define color variant types based on the project's color system
export type ButtonColor = 'primary' | 'secondary' | 'highlight' | 'decorative';

// Define size variants
export type ButtonSize = 'sm' | 'md' | 'lg';

// Define button types
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  url?: string;
  onClick?: () => void;
  color?: ButtonColor;
  size?: ButtonSize;
  type?: ButtonType;
  download?: boolean;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

const colorClasses: Record<ButtonColor, string> = {
  primary: 'bg-accent-primary text-background-base hover:bg-accent-secondary',
  secondary: 'bg-accent-secondary text-background-base hover:bg-accent-primary',
  highlight: 'bg-accent-highlight text-background-base hover:bg-accent-primary',
  decorative:
    'bg-accent-decorative text-background-base hover:bg-accent-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-base',
  md: 'px-5 py-2.5 text-lg',
  lg: 'px-6 py-3 text-xl',
};

export default function Button({
  children,
  url,
  onClick,
  color = 'primary',
  size = 'md',
  type = 'button',
  download = false,
  className = '',
  disabled = false,
  target,
  rel,
  ...rest
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer';
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClasses =
    `${baseClasses} ${colorClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  // If URL is provided, render as a link
  if (url) {
    return (
      <a
        href={url}
        className={combinedClasses}
        download={download}
        target={target}
        rel={rel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Otherwise render as a button
  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
