import { ImageResponse } from 'next/og';

// For static export, we can't use dynamic parameters
// so we'll just use a default title
export const dynamic = 'error';

export function GET() {
  // Using a fixed title for static export
  let title = 'Weston Mossman Portfolio';

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
