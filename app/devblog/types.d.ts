// Define page props interface for Next.js 15
interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}

// Type declarations for page and layout components
declare namespace React {
  interface FC<P = {}> {
    (props: P): React.ReactElement | null;
  }
}

// Type declarations for Next.js
declare namespace NextPage {
  type WithParams<T = {}> = React.FC<T & PageProps>;
}
