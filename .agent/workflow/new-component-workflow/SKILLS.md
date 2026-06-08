# New Component Workflow

Load this workflow whenever creating a new component in PlateUp.

The goal is to ensure all components are built consistently and follow the approved architecture, design system, and code standards.

Always read:

- AGENTS.md
- ARCHITECTURE.md
- DESIGN_SYSTEM.md
- CODE_STYLE.md
- skills/component-builder/SKILLS.md

before creating a component.

---

# Step 1: Determine Component Scope

Ask:

```text
Is this component reusable?
```

If yes:

```text
components/
```

If no:

```text
app/.../_components/
```

Keep page-specific components close to the page.

Promote components only when reuse becomes necessary.

---

# Step 2: Check Existing Components

Search for existing components before creating new ones.

Ask:

```text
Can an existing component be reused?

Can an existing component be extended?

Can a variant solve this?
```

Avoid duplication.

---

# Step 3: Determine Component Type

Choose the correct category.

Examples:

```text
UI Primitive
Authentication Component
Onboarding Component
Dashboard Component
Meal Planning Component
Shared Component
```

Place the component in the correct directory.

---

# Step 4: Decide Server or Client

Default:

```text
Server Component
```

Only use:

```tsx
'use client'
```

when required.

Examples:

- useState
- useEffect
- Browser APIs
- Interactive Events

Keep client boundaries small.

---

# Step 5: Define Component API

Create a typed props object.

Requirements:

- Clear names
- Minimal props
- Explicit behavior

Avoid unnecessary configuration.

---

# Step 6: Apply Design System

Follow:

- Color Roles
- Typography Scale
- Spacing Tokens
- Accessibility Rules

Never hardcode:

- Colors
- Font Sizes
- Spacing Values

Use design tokens.

---

# Step 7: Accessibility Review

Verify:

- Keyboard Navigation
- Focus States
- Labels
- Semantic HTML
- Alt Text

Accessibility is mandatory.

---

# Step 8: Handle States

Consider:

```text
Loading
Empty
Error
Disabled
Success
```

Do not leave users without feedback.

---

# Step 9: Review Component

Confirm:

- Correct Location
- Correct Typing
- Design System Compliance
- Accessibility Compliance
- Server Component First
- No Duplication

---

# Step 10: Final Validation

Before completion verify:

- Component follows AGENTS.md
- Component follows DESIGN_SYSTEM.md
- Component follows CODE_STYLE.md
- Component follows Component Builder Skill

Only then should implementation be considered complete.

---

# Common Mistakes

- Creating duplicate components.
- Making everything a client component.
- Hardcoding design values.
- Ignoring accessibility.
- Bypassing design tokens.
- Building reusable components inside pages.
- Adding unnecessary props.