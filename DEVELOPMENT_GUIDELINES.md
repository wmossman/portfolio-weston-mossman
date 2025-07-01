# Development Guidelines

This document outlines the coding standards and development practices for this project.

## Design Aesthetics

### No Colored Borders

- **NEVER** use colored borders around any elements
- This does not fit with the design aesthetic of this project
- Use alternative visual separators like:
  - Subtle shadows
  - Background color changes
  - Spacing/padding
  - Underlines or subtle dividers

### Examples of What NOT to Do:

```css
/* ❌ AVOID */
.element {
  border: 2px solid #ff0000;
  border-color: blue;
  border: 1px solid var(--primary-color);
}
```

### Preferred Alternatives:

```css
/* ✅ PREFERRED */
.element {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Package Management

### Always Use pnpm

- **NEVER** use `npm` commands
- Always use `pnpm` for all package management operations
- This includes:
  - Installing packages: `pnpm install`
  - Adding dependencies: `pnpm add package-name`
  - Running scripts: `pnpm run script-name`
  - Development server: `pnpm dev`

## Build Process

### Lint Before Build

- **ALWAYS** run `pnpm run lint:fix` before `pnpm run build`
- This prevents build failures due to linting issues
- The proper sequence is:
  1. `pnpm run lint:fix`
  2. `pnpm run build`

### Updated Build Script

The build process should follow this pattern:

```bash
pnpm run lint:fix && pnpm run build
```

## Code Quality

### Linting

- ESLint configuration is already set up
- Always fix linting issues before committing
- Use `pnpm run lint:fix` to automatically fix issues

### Testing

- Run tests with: `pnpm test`
- Watch mode: `pnpm run test:watch`
- Coverage: `pnpm run test:coverage`

## Development Workflow

1. Start development: `pnpm dev`
2. Make your changes
3. Run tests: `pnpm test`
4. Fix linting: `pnpm run lint:fix`
5. Build: `pnpm run build`
6. Commit changes

## AI Assistant Guidelines

When making suggestions or implementing features:

1. **Never suggest colored borders** - use alternative visual separators
2. **Always use pnpm commands** - never npm
3. **Always lint before building** - include `pnpm run lint:fix` in build workflows
4. **Follow the established architecture** - maintain consistency with existing patterns
5. **Create high quality, and if possible, reusable TS types** - don't use 'any' ANYWHERE
