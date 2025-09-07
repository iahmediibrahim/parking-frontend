# Parking Management Frontend

This is a [Next.js](https://nextjs.org) project for a parking management system.

## Project Structure

The project follows a feature-based architecture for better organization and maintainability:

```
src/
├── app/                  # Next.js app router pages
├── components/           # Shared UI components
├── core/                 # Core utilities and types
│   ├── api/              # API client and query utilities
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── features/             # Feature-based modules
│   ├── admin/            # Admin-related features
│   ├── auth/             # Authentication features
│   ├── gates/            # Gate management features
│   ├── subscriptions/    # Subscription management features
│   ├── tickets/          # Ticket management features
│   ├── websocket/        # WebSocket communication features
│   └── zones/            # Parking zone management features
└── middleware.ts         # Next.js middleware
```

Each feature directory contains:
- `components/`: UI components specific to the feature
- `hooks/`: React hooks for the feature
- `store/`: State management for the feature (if applicable)
- `utils/`: Utility functions specific to the feature
- `index.ts`: Exports all public APIs from the feature

## Getting Started

First, run the development server:

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
