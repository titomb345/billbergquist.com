# CLAUDE.md - Project Context for Claude

## Project Overview

This is Bill Bergquist's personal website built with React 19, TypeScript 5, and Vite.

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.7** - Type safety
- **Vite 6** - Build tool and dev server
- **Prettier** - Code formatting

## Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── index.html      # HTML entry point
├── vite.config.ts  # Vite configuration
├── tsconfig.json   # TypeScript configuration
├── public/
│   └── favicon.ico # Static assets
└── src/
    ├── main.tsx    # App entry point
    ├── App.tsx     # Main app component
    └── index.css   # Global styles
```

## Development Notes

- Development server runs on http://localhost:5173
- Code formatting follows Prettier config in `.prettierrc.json`
- Production build outputs to `dist/` folder
