# Math Fun - Kids Addition Game

## Overview

This is a kid-friendly math game focused on single-digit addition problems. The application features a React frontend with an Express.js backend, designed to provide an engaging educational experience with interactive animations, timed challenges, and score tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom game logic
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom game-themed color variables
- **Animations**: Framer Motion for interactive game elements
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: In-memory storage (MemStorage class) for development
- **API**: RESTful endpoints for game statistics and high scores
- **Database Provider**: Neon Database (serverless PostgreSQL)

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **TypeScript**: Strict mode enabled with path mapping
- **Development**: Hot module replacement and runtime error overlay

## Key Components

### Game Logic (`/hooks/use-game.ts`)
- Question generation for single-digit addition
- Timer management for 5-second rounds
- Score tracking and statistics collection
- Game state management (playing, paused, ended)

### UI Components (`/client/src/components/`)
- **GameHeader**: Start screen with high score display
- **GameStats**: Real-time score and progress tracking
- **QuestionCard**: Interactive question display with answer buttons
- **Success/Wrong Modals**: Feedback animations for answers
- **Confetti**: Celebration animations for correct answers

### Backend Services
- **Storage Interface**: Abstracted storage layer supporting multiple backends
- **Game Stats API**: CRUD operations for game statistics
- **High Score API**: Retrieval of best performance metrics

## Data Flow

1. **Game Initialization**: User starts game, timer begins, first question generated
2. **Question Display**: Random addition problem with two answer choices
3. **Answer Selection**: User selects answer, immediate feedback provided
4. **Score Calculation**: Points awarded for correct answers within time limit
5. **Game End**: Statistics saved to backend, high score updated if necessary
6. **Score Persistence**: Game results stored in PostgreSQL database

## External Dependencies

### Frontend Libraries
- **@radix-ui/***: Accessible UI primitives (dialogs, buttons, etc.)
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for game interactions
- **wouter**: Lightweight routing solution
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Backend Libraries
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **express**: Web application framework
- **zod**: Schema validation (via drizzle-zod)

### Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot reload
- Express server with tsx for backend hot reload
- PostgreSQL database via Neon Database connection
- Replit integration with development banner and cartographer

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command
- Static assets: Served via Express static middleware in production

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- Database schema: Defined in `shared/schema.ts` with Drizzle

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```