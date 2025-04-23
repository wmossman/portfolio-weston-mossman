# portfolio-weston-mossman
Weston Mossman's portfolio web app

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).

### Notes

// Solution for Jest not parsing React JSX/TSX:
// - Added babel.config.js with @babel/preset-env, @babel/preset-react, @babel/preset-typescript
// - Updated jest.config.js to use babel-jest for js, jsx, ts, tsx
// - Installed required Babel dependencies
// - Cleared Jest cache
// This resolved the "SyntaxError: Unexpected token '<'" issue when running Jest tests on React components.
