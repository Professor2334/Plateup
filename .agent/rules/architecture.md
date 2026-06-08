---
trigger: always_on
---

# ARCHITECTURE.md

This document defines the technical architecture of PlateUp.

All contributors and AI coding agents must follow these architectural rules when implementing features. Do not introduce new patterns, frameworks, services, or architectural approaches without explicit approval.

---

# Architecture Principles

PlateUp is designed around the following principles:

- Simplicity over complexity
- Server Actions over Route Handlers when possible
- Maintainability over clever solutions
- Responsive experiences across mobile, tablet, and desktop
- Nigerian-first user experience
- AI-assisted meal planning as the core product experience
- Strict adherence to MVP scope

---

# The Stack

PlateUp is a Next.js 14 application using the App Router and written in TypeScript.

The application uses PostgreSQL hosted on Neon and Prisma as the ORM.

Authentication is handled by Auth.js with email verification powered by Resend.

AI meal generation is powered by DeepSeek.

There is no separate backend service.

Everything lives inside the Next.js application using:

- Server Components
- Server Actions
- Route Handlers (only when necessary)

## Technology Stack

| Layer | Technology |
|---------|---------|
| Frontend | Next.js 14 (App Router) |
| UI Components | shadcn/ui |
| Backend | Next.js 14 (Server Actions First + Route Handlers) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | Auth.js |
| Email | Resend (Primary), Nodemailer (Fallback) |
| Validation | Zod |
| Rate Limiting | Upstash |
| AI | DeepSeek API |
| Hosting | Vercel |

---

# Directory Layout

```text
app/
├── (auth)/
├── dashboard/
├── actions/
│   ├── auth/
│   ├── onboarding/
│   └── meal-plans/
├── api/
│   └── auth/
├── layout.tsx
└── page.tsx

components/
├── ui/
├── auth/
├── onboarding/
├── dashboard/
├── meal-plans/
└── shared/

lib/
├── auth.ts
├── db.ts
├── deepseek.ts
├── resend.ts
├── validators.ts
└── utils.ts

prisma/
├── schema.prisma
└── migrations/

public/
```

---

# UI Architecture

## Authentication Experience

Authentication should be implemented as a unified experience using conditional rendering where practical.

Supported states:

- Sign Up
- Login
- Email Verification
- Forgot Password
- Reset Password

Authentication should remain simple and avoid unnecessary page transitions.

---

## Onboarding Experience

Onboarding occurs after login.

Required onboarding steps:

1. Household Size
2. Primary Goal

Users cannot access the dashboard until onboarding is completed.

User Flow:

Sign Up
↓
Receive Verification Email
↓
Verify Email
↓
Login
↓
Complete Onboarding
↓
Access Dashboard

---

## Dashboard Experience

The dashboard should favor a single-application experience.

Possible views:

- Generate Meal Plan
- Meal History
- Saved Plans
- Profile
- Settings

Use conditional rendering where appropriate.

Avoid unnecessary routing complexity.

---

# Rendering Rules

## Landing Page

The landing page should be server rendered for performance and SEO.

---

## Authentication Pages

Authentication pages may use client components where necessary.

Sensitive operations must remain server-side.

---

## Dashboard

Dashboard data should be fetched on the server whenever possible.

Prefer:

Server Component
↓
Fetch Data
↓
Pass Data To Client Component

Instead of:

Client Component
↓
Fetch Data From API
↓
Render

---

# Backend Architecture

## Primary Pattern

PlateUp follows a Server Actions First architecture.

Expected distribution:

- 80–90% Server Actions
- 10–20% Route Handlers

---

## Request Flow

Frontend
↓
Server Action
↓
Zod Validation
↓
Business Logic
↓
Database / DeepSeek API
↓
Response

---

## Server Actions

Server Actions handle:

- Authentication
- Password Reset
- Email Verification
- Onboarding
- Meal Generation
- Meal History
- Save Meal Plan
- Delete Meal Plan
- Reuse Meal Plan

## Route Handlers

Route Handlers should only be used when required.

Examples:

- Auth.js requirements
- External callbacks
- Third-party integrations

Do not build API routes when a Server Action can accomplish the same task.

---

# Data Flow

There are three primary write operations in PlateUp.

## Authentication Writes

User submits form
↓
Server Action
↓
Validation
↓
Database Update
↓
Email Notification

Examples:

- Sign Up
- Password Reset
- Email Verification

---

## Onboarding Writes

User completes onboarding
↓
Server Action
↓
Validation
↓
Database Update

---

## Meal Generation Writes

User submits budget and ingredients
↓
Server Action
↓
Validation
↓
DeepSeek
↓
Database
↓
Response

This is the most important workflow in the application.

---

# AI Architecture

## DeepSeek Responsibilities

DeepSeek is responsible for:

- Weekly meal plan generation
- Shopping list generation
- Budget-aware recommendations

---

## AI Rules

Meal plans must:

- Prioritize Nigerian meals
- Respect budget constraints
- Respect household size
- Respect primary goals
- Utilize available ingredients

---

## AI Validation

All AI responses must be validated before storage.

Malformed responses must be rejected.

---

# State Management

PlateUp does not require a global state management library.

Use:

- Server Components
- React State
- Server Actions

before introducing additional complexity.

Do not add:

- Redux
- Zustand
- MobX
- Jotai

without approval.

---

# Database Access

All database operations go through Prisma.

Do not use raw SQL except when absolutely necessary.

The Prisma client must be imported from:

lib/db.ts

Do not instantiate multiple Prisma clients.

---

# Data Ownership Rules

All user-scoped queries must be filtered using the authenticated user's id.

Users may only access their own:

- Meal Plans
- Saved Meal Plans
- Meal History
- Profile Information
- Onboarding Data

Never expose another user's data through:

- Server Actions
- Route Handlers
- Database Queries
- Client Components

Authorization checks must occur on the server before returning user-scoped data.

Ownership validation is required for all update and delete operations.

---

# Authentication

Authentication uses Auth.js.

Requirements:

- Email Verification
- Protected Routes
- Password Reset
- Session Management

Users must verify their email before gaining access.

Users must complete onboarding before gaining dashboard access.

---

# Error Handling

All server operations should return structured responses.

Success:

```ts
{
  success: true,
  data
}
```

Failure:

```ts
{
  success: false,
  error: {
    code,
    message
  }
}
```

Never expose:

- Stack traces
- Prisma errors
- Internal exceptions
- Secrets

to users.

---

# Caching Strategy

PlateUp uses Next.js caching and revalidation mechanisms.

Use `revalidatePath` (e.g., `revalidatePath('/dashboard')`) inside Server Actions as the primary mechanism to purge cached data after mutations. For more granular data-fetching, use `revalidateTag` if tag-based cache keys are configured.

After successful mutations, relevant data must be revalidated to ensure users see the latest information.

Examples:

- Generate Meal Plan → Revalidate Dashboard Data
- Save Meal Plan → Revalidate Meal History
- Delete Meal Plan → Revalidate Meal History
- Update Profile → Revalidate User Profile Data
- Complete Onboarding → Revalidate Dashboard Access State

Prefer targeted revalidation over full page refreshes.

Avoid unnecessary client-side refetching when server-side revalidation can provide fresh data.

---

# Environments

Environment variables are loaded locally from `.env` or `.env.local` for development, and configured in the Vercel Dashboard for production deployments.

## Development

- Local development
- Development database
- Development DeepSeek configuration

## Production

- Production database
- Production email provider
- Production DeepSeek configuration

Hosted on Vercel.

---

# What Not To Do

- Do not add GraphQL.
- Do not create a separate backend service.
- Do not introduce microservices.
- Do not add unnecessary API routes.
- Do not introduce global state libraries without approval.
- Do not bypass Server Actions for core workflows.
- Do not build features outside the approved MVP scope.
- Do not introduce payment systems.
- Do not introduce subscription billing.