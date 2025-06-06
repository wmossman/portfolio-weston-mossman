# portfolio-weston-mossman
Weston Mossman's portfolio web app

## Projects POC

This proof-of-concept adds a sortable, filterable Projects feature at `/projects`.

### Data format
- Projects are defined in `app/projects/utils.ts` as an array of objects, each referencing an MDX file in `app/projects/content/{slug}.mdx`.
- Each MDX file contains frontmatter (title, tags, image) and markdown/JSX body.

### Adding a project
1. Create a new MDX file in `app/projects/content/your-slug.mdx` with frontmatter:
   ```mdx
   ---
   title: My Project Title
   tags:
     - tag1
     - tag2
   image: /images/your-image.jpg
   ---
   # My Project Title
   Project description here.
   ```
2. Add a new entry to the `projects` array in `app/projects/utils.ts` referencing your MDX file and metadata.

### Features
- Responsive grid of project cards, filterable by tag.
- Tag filter bar with color-coded pills.
- MDX-powered detail pages at `/projects/[slug]`.
- “More on the way!” static card.
- Automated tests for grid, filtering, navigation, and MDX render.

### Tech
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for tests.

### Testing
Run all tests:
```bash
npm test
```

### Lint & Build
```bash
npm run lint
npm run build
```

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/devblog blog
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
