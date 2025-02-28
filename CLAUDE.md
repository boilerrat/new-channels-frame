# CLAUDE.md - Project Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint -- --fix` - Fix linting issues
- `npm run lint -- src/path/to/file.ts` - Lint specific file

## Code Style
- **TypeScript**: Use TypeScript for all files (.ts/.tsx)
- **Naming**: Descriptive names (isLoading, hasChannels)
- **Components**: Functional with hooks, single-purpose
- **Imports**: Group by external/internal, alphabetize
- **Error Handling**: Try/catch with proper fallbacks, descriptive messages
- **File Structure**: Lowercase with dashes for directories

## Architecture
- Follow Next.js App Router patterns
- Separate API logic from UI components
- Keep frame-specific logic isolated
- Use server-side data fetching when possible
- Implement proper type safety with zod for validation

## Farcaster Frame Guidelines
- Follow Farcaster Frame v2 specs exactly
- Use proper frame validation and metadata
- Handle frame actions efficiently
- Process images on server-side with proper optimization