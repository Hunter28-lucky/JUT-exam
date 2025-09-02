# QW question wala Guss paper

## Overview

A full-stack educational platform built for QW question wala Guss paper students. The application provides study materials, resources, and payment processing through a package-based system. Students can select their semester and branch to access relevant educational content through Basic, Premium, and Ultimate packages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation via Hookform Resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with `/api` prefix routing
- **Development**: TSX for TypeScript execution in development
- **Build**: ESBuild for production bundling with external packages

### Data Storage
- **Database**: PostgreSQL configured via DATABASE_URL environment variable
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration**: Drizzle Kit for schema management and migrations
- **Connection**: Neon serverless driver for PostgreSQL connections
- **Fallback**: In-memory storage implementation for development/testing

### Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Schema**: Basic user model with username/password authentication
- **Validation**: Zod schemas for type-safe user input validation

### Development & Deployment
- **Development**: Vite dev server with HMR and development overlays
- **Production**: Static file serving with Express fallback
- **Platform**: Vercel deployment with serverless functions
- **Error Handling**: Runtime error modal for development debugging

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon serverless (@neondatabase/serverless)
- **Session Store**: PostgreSQL session storage (connect-pg-simple)

### UI & Design System
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts integration (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

### State & Data Management
- **Server State**: TanStack React Query for API state management
- **Form Handling**: React Hook Form with Zod resolvers
- **Validation**: Zod for runtime type checking and validation
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build Tool**: Vite with React plugin
- **Development**: Replit integration with cartographer and runtime error overlay
- **Type Checking**: TypeScript with strict configuration
- **Database Tools**: Drizzle Kit for schema management

### Deployment & Hosting
- **Platform**: Vercel with Node.js serverless functions
- **Static Assets**: Vercel static file serving
- **Environment**: Production/development environment detection