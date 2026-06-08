---
trigger: always_on
---

# CODE_STYLE.md

This document defines the coding standards for PlateUp.

All contributors and AI coding agents must follow these rules to keep the codebase consistent, maintainable, and easy to understand.

Consistency is more important than personal preference.

---

# Language

PlateUp uses TypeScript throughout the application.

Do not introduce JavaScript files into:

```text
app/
components/
lib/
actions/
```

Strict mode must remain enabled.

Do not disable TypeScript rules to silence errors.

Fix the type instead.

---

# Naming Conventions

## Components

Components use PascalCase.

Examples:

```text
MealPlanCard.tsx
BudgetIndicator.tsx
GenerateMealForm.tsx
```

---

## Server Actions

Server Actions use camelCase.

Examples:

```text
generateMealPlan
saveMealPlan
deleteMealPlan
completeOnboarding
```

---

## Utility Functions

Use camelCase.

Examples:

```text
formatCurrency
calculateBudgetStatus
generateShoppingList
```

---

## Constants

Use SCREAMING_SNAKE_CASE for fixed values.

Examples:

```text
MAX_MEAL_PLANS
MAX_BUDGET_LIMIT
DEFAULT_HOUSEHOLD_SIZE
```

---

## Boolean Variables

Booleans should read like questions.

Examples:

```text
isLoading
isVerified
hasMealHistory
canGeneratePlan
```

Avoid:

```text
loading
verified
history
generate
```

---

# File Organization

Prefer one component per file.

Order files as follows:

1. Imports
2. Types
3. Constants
4. Component
5. Helper Functions

Keep files focused and easy to understand.

---

# TypeScript Rules

Prefer:

```ts
type
```

over:

```ts
interface
```

unless there is a specific reason.

---

## Avoid Any

Do not use:

```ts
any
```

Use:

```ts
unknown
```

and properly narrow types.

---

## Validation

Use Zod for all external inputs.

Examples:

- Form Inputs
- Search Parameters
- Environment Variables
- AI Responses

Never trust external data.

---

# React Rules

Use function components only.

Do not use class components.

---

## Server Components First

Server Components are the default.

Only use:

```ts
'use client'
```

when necessary.

Examples:

- useState
- useEffect
- Browser APIs
- Interactive UI

---

## Component Size

Keep components focused.

If a component becomes difficult to understand, extract smaller pieces.

---

# Server Actions

PlateUp follows a Server Actions First architecture.

Business logic belongs in Server Actions.

Examples:

- Authentication
- Onboarding
- Meal Generation
- Meal History
- Database Operations

Do not create API routes when a Server Action can solve the problem.

---

# Database Rules

All database access goes through Prisma.

Import Prisma from:

```text
lib/db.ts
```

Do not create multiple Prisma clients.

---

## Ownership Validation

Always verify ownership before:

- Reading Data
- Updating Data
- Deleting Data

Users may only access their own data.

---

# Authentication Rules

Authentication uses Auth.js.

Protected functionality requires:

- Authentication
- Email Verification
- Completed Onboarding

Always validate user access on the server.

---

# Error Handling

Use try/catch around:

- Database Calls
- AI Calls
- External Services
- JSON Parsing

---

## Error Responses

Return structured errors.

Example:

```ts
{
  success: false,
  error: {
    message: 'Unable to generate meal plan'
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

# Async Code

Prefer:

```ts
async/await
```

over:

```ts
.then()
```

chains.

Always handle failures.

---

# Imports

Use the project alias.

Prefer:

```ts
import { Button } from '@/components/ui/button'
```

Avoid:

```ts
import { Button } from '../../../components/ui/button'
```

---

# Styling

PlateUp styling is driven by:

- Design Tokens
- Color Roles
- Typography Tokens
- Spacing Tokens

Implementation uses:

- shadcn/ui

The Design System is the source of truth for all visual decisions.

Do not use:

- Inline Styles
- CSS Modules
- Styled Components

Follow the Design System.

---

# Comments

Comments should explain:

```text
Why
```

not:

```text
What
```

Good:

```ts
// Prevent duplicate meal plan generation requests.
```

Bad:

```ts
// Generate meal plan.
```

---

# AI Integration Rules

DeepSeek is responsible for:

- Meal Plan Generation
- Shopping List Generation

Always validate AI responses before saving them.

Never trust AI output blindly.

---

# Performance

Prefer:

- Server Components
- Server Actions
- Targeted Revalidation

Avoid unnecessary client-side fetching.

Avoid unnecessary re-renders.

---

# What Not To Do

- Do not disable TypeScript rules.
- Do not use any.
- Do not create unnecessary API routes.
- Do not bypass Server Actions.
- Do not expose secrets.
- Do not bypass ownership validation.
- Do not hardcode design values when tokens exist.
- Do not introduce new dependencies without approval.
- Do not build outside the approved MVP scope.