# NextBB

A modern Bulletin Board application built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Drizzle ORM](https://orm.drizzle.team), and [Tailwind CSS](https://tailwindcss.com).

## Features

- **Next.js 15**: App Router, Server Components, and Server Actions.
- **Database**: Postgres managed by Supabase, accessed via Drizzle ORM.
- **Authentication**: Supabase Auth.
- **Styling**: Tailwind CSS with Shadcn UI components.
- **Type Safety**: Full TypeScript support.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd NextBB
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables. You can obtain these credentials from your Supabase project settings.

```bash
# Database Connection (Transaction Mode is recommended for Serverless)
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 4. Database Setup

This project uses Drizzle ORM. You'll need to push the schema to your Supabase database.

```bash
npx drizzle-kit push
```

### 5. Run the development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: React components (including UI components from Shadcn).
- `src/db`: Database schema and client configuration.
- `src/lib`: Utility functions and Supabase client setup.
- `drizzle.config.ts`: Configuration for Drizzle Kit.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=github&utm_campaign=next-bulletin-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
