# Component Builder Skill

Load this skill whenever creating, modifying, or refactoring a React component in PlateUp.

This skill defines how components should be structured, styled, organized, and implemented throughout the application.

Always follow:

- AGENTS.md
- ARCHITECTURE.md
- DESIGN_SYSTEM.md
- CODE_STYLE.md

before creating new components.

---

# Before You Start

Before creating a component ask:

1. Does a similar component already exist?
2. Can an existing component be extended?
3. Is this a reusable component or a page-specific component?

Avoid creating duplicate component patterns.

Consistency is more important than convenience.

---

# Component Organization

PlateUp components live inside:

```text
components/
├── ui/
├── auth/
├── onboarding/
├── dashboard/
├── meal-plans/
└── shared/
```

---

## ui/

Reusable primitives.

Examples:

```text
Button
Input
Textarea
Card
Dialog
Badge
Avatar
```

---

## auth/

Authentication-specific components.

Examples:

```text
LoginForm
SignupForm
ForgotPasswordForm
ResetPasswordForm
VerificationBanner
```

---

## onboarding/

Onboarding-specific components.

Examples:

```text
HouseholdSizeStep
PrimaryGoalStep
OnboardingProgress
```

---

## dashboard/

Dashboard-only components.

Examples:

```text
DashboardHeader
BudgetStatusCard
ProfileCard
```

---

## meal-plans/

Meal-planning specific components.

Examples:

```text
MealPlanCard
MealHistoryCard
ShoppingListCard
```

---

## shared/

Components shared across multiple domains.

Examples:

```text
EmptyState
LoadingState
PageHeader
```

---

# Component File Structure

Order files as follows:

1. Imports
2. Types
3. Constants
4. Component
5. Helper Functions

Example:

```tsx
import ...

type ComponentProps = {};

const CONSTANT = ...;

export function Component() {
  ...
}

function helper() {
  ...
}
```

---

# Export Rules

Use named exports.

Preferred:

```tsx
export function MealPlanCard() {}
```

Avoid:

```tsx
export default function MealPlanCard() {}
```

---

# Props Rules

Props should:

- Be typed
- Be minimal
- Be explicit

Required props first.

Optional props second.

---

# Server Components First

Server Components are the default.

Only use:

```tsx
'use client'
```

when necessary.

Examples:

- useState
- useEffect
- Browser APIs
- Interactive Events

Do not add client boundaries unnecessarily.

---

# Styling Rules

All styling must follow:

- DESIGN_SYSTEM.md
- Color Roles
- Typography Scale
- Spacing Tokens

Do not hardcode:

- Colors
- Font Sizes
- Spacing Values

Use design tokens instead.

---

# Accessibility

All components must support accessibility.

Requirements:

- Keyboard Navigation
- Visible Focus States
- Proper Labels
- Semantic HTML

---

# Component States

Components should support appropriate states.

Examples:

- Loading
- Empty
- Error
- Disabled

Avoid leaving users without feedback.

---

# Meal Planning Components

Meal-planning interfaces are core product functionality.

Meal-related components should prioritize:

- Readability
- Scanability
- Clear hierarchy

Users should quickly understand:

- Meals
- Costs
- Shopping Lists
- Actions

---

# Dashboard Components

Dashboard components should support:

- Single application experience
- Conditional rendering
- Clear information hierarchy

Avoid unnecessary complexity.

---

# Common Mistakes

- Creating duplicate components.
- Making everything a client component.
- Hardcoding design values.
- Ignoring accessibility.
- Mixing visual patterns.
- Bypassing design tokens.
- Building reusable components inside page files.