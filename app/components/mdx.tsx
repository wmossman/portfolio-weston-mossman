import Link from 'next/link';
import { highlight } from 'sugar-high';
import React from 'react';
import ImageWithFallback from 'app/components/ImageWithFallback';
import { MDXRemote } from 'next-mdx-remote/rsc';

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <ImageWithFallback alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(
      typeof children === 'string' ? children : React.Children.toArray(children).map(child => (typeof child === 'string' ? child : '')).join(' ')
    );
    return React.createElement(
      `h${level}`,
      { id: slug, className: 'relative group' },
      <>
        <a href={`#${slug}`} className="anchor" />
        {children}
      </>
    );
  };
  Heading.displayName = `Heading${level}`;
  return Heading;
}

// Add standard table element overrides for MDX
const Table = (props) => <table {...props} />;
const THead = (props) => <thead {...props} />;
const TBody = (props) => <tbody {...props} />;
const TR = (props) => <tr {...props} />;
const TH = (props) => <th {...props} />;
const TD = (props) => <td {...props} />;

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  table: Table,
  thead: THead,
  tbody: TBody,
  tr: TR,
  th: TH,
  td: TD,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
