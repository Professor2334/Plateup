# AGENTS.md

This file provides context for AI coding agents working on the PlateUp codebase.

> Read this fully before making any changes, generating code, or suggesting architecture decisions.

---

# 1. Product Overview

## Product Summary

PlateUp is an AI-powered meal planning platform built specifically for Nigerian households.

The platform helps users generate budget-aware Nigerian meal plans based on their available ingredients, household size, and personal goals.

## Core User Loop

Sign Up → Verify Email → Login → Complete Onboarding → Generate Meal Plan → Save Meal Plan → Reuse Meal Plan → Share via WhatsApp

## Product Positioning

PlateUp is not:

- A recipe website
- A grocery delivery platform
- A calorie tracker
- A nutrition analysis platform
- A grocery marketplace

PlateUp is:

- An AI-powered meal planning assistant
- Built specifically for Nigerian households
- Budget-aware
- Ingredient-aware
- Practical and easy to use

## Product Mission

Help Nigerian households make smarter food decisions by transforming budgets and available ingredients into practical weekly meal plans.

---

# 2. Tech Stack

| Layer | Technology |
|---------|---------|
| Frontend | Next.js 14 (App Router) |
| Backend | Next.js 14 (Server Actions First + Route Handlers) |
| Language | TypeScript |
| Database | PostgreSQL (Hosted on Neon) |
| ORM | Prisma |schema lives in `prisma/schema.prisma` |
| Authentication | Auth.js | (NextAuth )
| UI Primitives | Shadcn UI |
| Email | Resend (Primary), Nodemailer (Fallback) |
| Validation | Zod |
| Rate Limiting | Upstash |
| AI | DeepSeek API |
| Hosting | Vercel | Environment variables set in vercel dashboard

---

# 3. Project Structure (Expected)

```text
plateup/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── actions/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   └── meal-plans/
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   └── meal-plans/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── deepseek.ts
│   ├── resend.ts
│   ├── validators.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
```

## Structure Rules

- Server Actions are the primary backend pattern.
- Keep business logic out of UI components.
- Reuse existing components whenever possible.
- Follow existing folder conventions before creating new folders.

---

# 4. MVP Baseline Data Models

These are the current MVP baseline schemas.

Additional fields should only be introduced when approved through product requirements or architecture documentation.

```prisma
model User {
  id             String   @id @default(cuid())
  name           String
  email          String   @unique
  password       String
  emailVerified  Boolean
  createdAt      DateTime
  updatedAt      DateTime
}

model MealPlan {
  id             String
  userId         String
  budget         Float
  ingredients    String
  generatedPlan  Json
  shoppingList   Json
  createdAt      DateTime
  updatedAt      DateTime
}
```

## Model Rules

- Email must be unique.
- Users can only access their own meal plans.
- Email verification is mandatory.
- Meal plans must belong to a valid user.

---

# 5. Core User Flows

## Complete User Journey

1. Sign Up
2. Receive Verification Email
3. Verify Email
4. Login
5. Complete Onboarding
   - Household Size
   - Primary Goal
6. Access Dashboard
7. Generate Meal Plan
8. Save Meal Plan
9. Reuse Meal Plan
10. Share via WhatsApp

## Meal Generation Flow

1. Enter Weekly Budget
2. Enter Available Ingredients
3. Generate Meal Plan
4. Generate Shopping List
5. Save Meal Plan

## Meal History Flow

1. View Saved Meal Plans
2. Reuse Meal Plan
3. Delete Meal Plan

---

# 6. Edge Cases & Error Handling

## Account Creation

### Verification Email Not Received

- Allow verification email resend.
- Allow email correction.
- Display troubleshooting instructions.

### Verification Link Expired

- Display expiration notice.
- Generate a new verification link.

## Onboarding

### Onboarding Incomplete

- Prevent dashboard access until onboarding is completed.

## Meal Generation

### AI Service Unavailable

- Display friendly error message.
- Allow retry.

### Meal Generation Timeout

- Continue processing.
- Inform user that processing is taking longer than expected.

### Budget Too Low

- Warn the user that meal variety may be limited.
- Generate the most affordable recommendations possible.

### No Ingredients Provided

- Generate recommendations using budget and onboarding preferences.

## Meal History

### Deleted Meal Plan Reuse Attempt

- Inform user that the meal plan is no longer available.

## WhatsApp Sharing

### WhatsApp Unavailable

- Offer copy-to-clipboard functionality.

---

# 7. Critical System Rules

## Authentication

- Email verification is mandatory.
- Protected routes require authentication.
- Unverified users cannot access application features.

## Onboarding

- Onboarding is mandatory.
- Users must complete onboarding before accessing the dashboard.
- Onboarding consists of:
  - Household Size
  - Primary Goal

## Meal Generation

- DeepSeek must generate all meal plans.
- Shopping lists must be generated alongside meal plans.
- Nigerian meals must be prioritized.

## Security

- Never expose secrets to the client.
- Validate all inputs.
- Hash passwords before storage.

## Data Ownership

- Users may only access their own data.
- Users may only modify their own meal plans.

---

# 8. Backend Architecture

## Architecture Pattern

PlateUp follows a Server Actions First architecture.

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

## Server Actions

Server Actions are responsible for:

- Authentication
- Email Verification
- Onboarding
- Meal Generation
- Meal History
- Database Operations

## Route Handlers

Use Route Handlers only when absolutely necessary.

Expected usage:

- Auth.js requirements
- External callbacks
- Third-party integrations

## Architecture Distribution

- 80–90% Server Actions
- 10–20% Route Handlers

---

# 9. UI Architecture

## Experience Strategy

PlateUp favors simple user experiences using conditional rendering where appropriate.

## Authentication Experience

Possible states:

- Login
- Sign Up
- Email Verification
- Forgot Password
- Reset Password

Authentication should be handled through a unified experience.

## Onboarding Experience

Onboarding is presented immediately after a successful login.

Steps:

1. Household Size
2. Primary Goal

Users must complete onboarding before accessing the dashboard.

## Dashboard Experience

Possible views:

- Generate Meal Plan
- Meal History
- Saved Plans
- Profile
- Settings

Minimize unnecessary page transitions.

## Recommended Routes

/
Landing Page

/auth
Authentication Experience

/dashboard
Application Experience

---

# 10. AI Integration (DeepSeek)

## AI Responsibilities

- Meal generation
- Shopping list generation
- Budget-aware recommendations

## AI Requirements

- Prioritize Nigerian meals.
- Respect household size.
- Respect user goals.
- Respect budget constraints.
- Utilize available ingredients whenever possible.

## AI Validation Rules

- Validate AI responses before storage.
- Reject malformed outputs.

---

# 11. Authentication & Email Verification

## Features

- Sign Up
- Login
- Logout
- Email Verification
- Password Reset
- Protected Routes

## Email Providers

Primary:

- Resend

Fallback:

- Nodemailer

## User Flow

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

# 12. Notification Logic

| Trigger | Channel |
|----------|----------|
| Email Verification | Email |
| Password Reset | Email |
| Meal Plan Generated | Dashboard |
| Meal Plan Saved | Dashboard |

---

# 13. Environment Variables

```env
DATABASE_URL=

AUTH_SECRET=
AUTH_URL=

RESEND_API_KEY=
EMAIL_FROM=

DEEPSEEK_API_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

# 14. Engineering Principles

- Simplicity over complexity.
- Reuse existing components before creating new ones.
- Follow MVP scope strictly.
- Favor maintainability over clever solutions.
- Server Actions over Route Handlers whenever possible.
- Do not build features outside approved requirements.

---

# 15. MVP Scope Guardrails

## Must Have

- Authentication
- Email Verification
- Onboarding
- Meal Generation
- Shopping List Generation
- Save Meal Plans
- Meal History

## Should Have

- Regenerate Meal Plan
- WhatsApp Sharing
- Budget Status Indicator


---

# 16. Key Product Constraints

- Fully responsive across mobile, tablet, and desktop devices.
- Nigerian-first recommendations.
- Budget-aware planning.
- Fast meal generation experience.
- Simplicity over feature bloat.
- No payment processing in MVP.
- No subscription billing in MVP.

---

# 17. Design System

PlateUp uses a custom design system.

- Primary Brand Color: `var(--color-primary)` (hsl(142, 72%, 29%))
- Typography: Inter
- Use design tokens where available. Refer to `DESIGN_SYSTEM.md` and use CSS variables/tokens for all colors. Do not hardcode raw values.
- shadcn/ui may be used as a component foundation.

Do not hardcode visual decisions that conflict with the design system.

---

# 18. Market Context

Target Users:

- Nigerian households
- Students
- Working professionals
- Families

Positioning:

"The AI meal planning assistant built specifically for Nigerian households."



## Coding Rules

- Use TypeScript strictly.
- Use Prisma for database access.
- Use Zod validation.
- Prefer Server Actions over Route Handlers.
- Follow existing project structure.
- Run linting and type checking before completion.
- Maintain responsive layouts.
- Follow the PlateUp design system.
- Do not introduce technologies outside the approved stack without approval.