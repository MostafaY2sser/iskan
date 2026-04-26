
# Institutional Housing Platform

A scalable, enterprise-grade housing management platform built with clean architecture principles and Domain-Driven Design.

## Architecture Overview

This application follows a feature-based clean architecture with strict separation of concerns:

### Folder Structure
```
src/
├── app/                    # Application layer (routing, configuration)
│   └── router.tsx         # Role-based routing system
├── features/              # Feature modules (UI + business logic)
│   ├── admin/             # Administrator features
│   ├── property-owner/    # Property owner features
│   ├── recruiting/        # Recruiting company features
│   └── auth/              # Authentication features
├── entities/              # Domain entities and types
│   ├── user/              # User domain
│   ├── organization/      # Organization domain
│   └── property/          # Property domain
├── providers/             # Global application providers
│   ├── AuthProvider.tsx   # Authentication state
│   ├── RoleProvider.tsx   # Role-based access control
│   ├── ThemeProvider.tsx  # Theme management
│   └── LanguageProvider.tsx # Internationalization
├── shared/               # Shared utilities and components
│   ├── components/       # Reusable UI components
│   └── utils/           # Shared utilities
└── lib/                 # Third-party library configurations
```

## Role-Based System

The platform supports three main user roles:

1. **Administrator** - Full system access and user management
2. **Property Owner** - Property management and tenant oversight
3. **Recruiting Company** - Housing placement and candidate management

## Development Setup

### Quick Start
```bash
npm install
npm run dev
```

### Mock Authentication
For development, use these test accounts:
- Admin: `admin@housing.com` / `password`
- Property Owner: `owner@housing.com` / `password`  
- Recruiting: `recruiter@housing.com` / `password`

## Key Features

### ✅ Implemented Foundation
- Clean architecture with DDD principles
- Role-based routing and access control
- Global providers (Auth, Role, Theme, Language)
- Lazy-loaded layouts and route protection
- Professional UI design system
- Mock authentication for development

### 🚧 Next Steps
- Property management system
- User administration interface
- Recruiting workflow
- Real-time notifications
- Reporting and analytics
- Backend integration

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for state management
- **Radix UI** component library
- **Clean Architecture** principles

## Development Guidelines

1. **Feature Isolation** - Each feature module is self-contained
2. **Type Safety** - Comprehensive TypeScript coverage
3. **Role Security** - Route guards and permission checks
4. **Performance** - Lazy loading and code splitting
5. **Scalability** - Domain-driven design patterns

## Contributing

Follow the established architecture patterns:
- Place UI components in feature-specific folders
- Define domain types in the entities layer
- Use providers for cross-cutting concerns
- Implement proper route guards for security
