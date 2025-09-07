# Parking Management Frontend

This is a [Next.js](https://nextjs.org) project for a parking management system.

## Project Structure

The project follows a feature-based architecture for better organization and maintainability:

```
parking-frontend/
├── .gitignore
├── .swc/
│   └── plugins/
│       └── macos_aarch64_18.0.0/
├── README.md
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── checkpoint/
│   │   ├── favicon.ico
│   │   ├── gate/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── core/
│   │   ├── api/
│   │   ├── index.ts
│   │   ├── types/
│   │   ├── utils/
│   │   └── websocket/
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── checkpoint/
│   │   ├── gate/
│   │   └── index.ts
│   ├── middleware.ts
│   └── shared/
│       ├── components/
│       ├── hooks/
│       └── index.ts
└── tsconfig.json
```

### Key Directories
- **src/app/**: Next.js app router and main pages
- **src/core/**: Core utilities, types, API clients, and websocket logic
- **src/features/**: Feature-based modules (admin, auth, checkpoint, gate, etc.)
- **src/shared/**: Shared components and hooks
- **public/**: Static assets (SVGs, icons)

Each feature directory may contain:
- `components/`: UI components specific to the feature
- `hooks/`: React hooks for the feature
- `store/`: State management for the feature (if applicable)
- `utils/`: Utility functions specific to the feature
- `index.ts`: Exports all public APIs from the feature

## Getting Started

First, install dependencies:

```bash
pnpm i
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
