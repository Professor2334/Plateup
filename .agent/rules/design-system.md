---
trigger: always_on
---

# DESIGN_SYSTEM.md

This document defines the visual language of PlateUp.

All designers, developers, and AI coding agents must follow these design rules when building interfaces.

The Design System establishes the visual foundation of the product and ensures a consistent user experience across the application.

PlateUp is a product for real households making everyday food decisions. The interface should feel practical, trustworthy, clear, and easy to use.



# Design Principles


Use CSS variables; never use raw values.

Before writing any style value, check the tokens file. If a variable exists for what you need, use it.

## UI Foundation

PlateUp uses shadcn/ui as a component foundation only.


---

## Consistency Creates Trust

Consistent spacing, typography, color usage, and layouts help users feel confident using the application.

Avoid introducing inconsistent patterns.

---

## Accessibility By Default

Accessibility is not optional.

Design decisions should support readability, usability, and inclusiveness.

---



## UI Foundation

PlateUp uses shadcn/ui as a component foundation only.

shadcn/ui is not the design system.

All visual decisions must come from:

- DESIGN_SYSTEM.md
- design-tokens.css

This includes:

- Colors
- Typography
- Spacing
- Radius
- Surface styles
- Layout patterns

Default shadcn styling should not be treated as the final UI.

Components should be customized to match the Plate



# Color System

PlateUp uses semantic color roles.

Colors should communicate meaning rather than decoration.

Always use approved color roles.

Do not introduce arbitrary colors.

Do not hardcode the Hex color codes.

---

# Key Color Roles

| Role | Value |
|---------|---------|
| Primary | hsl(142, 72%, 29%) |
| Secondary | hsl(142, 11%, 62%) |
| Tertiary | hsl(220, 11%, 46%) |
| Neutral | hsl(215, 2%, 12%) |
| Neutral Variant | hsl(0, 0%, 21%) |
| Error | hsl(0, 100%, 45%) |
| Accent | hsl(21, 92%, 62%) |

---

# Color Usage Strategy

## Primary

Purpose:

- Primary actions
- Main call-to-actions
- Key highlights
- Brand emphasis

Examples:

- Generate Meal Plan
- Save Meal Plan
- Continue

---

## Secondary

Purpose:

- Supporting actions
- Secondary emphasis
- Supporting surfaces

---

## Tertiary

Purpose:

- Informational emphasis
- Supporting content
- Alternate visual hierarchy

---

## Accent

Purpose:

- Important highlights
- Budget indicators
- Key notifications

Accent should be used sparingly.

---

## Error

Purpose:

- Validation errors
- Destructive actions
- Failed states

---

# Text Roles

Text should follow semantic hierarchy.

---

## Primary Text

Purpose:

- Headings
- Core content
- Primary information

Uses:

```text
On Background
On Surface
```

---

## Secondary Text

Purpose:

- Supporting information
- Labels
- Descriptions

Uses:

```text
On Surface Variant
```

---

## Muted Text

Purpose:

- Metadata
- Timestamps
- Helper text

Use sparingly.

---

## Error Text

Purpose:

- Validation messages
- Error states

Uses:

```text
On Error Container
```

---

# Surface Hierarchy

PlateUp uses surface hierarchy to create depth.

Prefer surface elevation before introducing shadows.

---

## Surface Lowest

Use for:

- Base surfaces
- Primary page backgrounds

---

## Surface Low

Use for:

- Secondary containers
- Supporting content

---

## Surface

Use for:

- Standard cards
- General content containers

---

## Surface High

Use for:

- Elevated cards
- Important content blocks

---

## Surface Highest

Use for:

- Dialogs
- Modal surfaces
- Priority overlays

---

# State Colors

State colors communicate status.

Always combine color with text.

Never rely on color alone.

---

## Success

Purpose:

- Successful actions
- Completed states
- Positive outcomes

Use primary role family.

---

## Warning

Purpose:

- Budget approaching limits
- Attention required

Use accent role family.

---

## Error

Purpose:

- Failed actions
- Validation errors

Use error role family.

---

# Color Rules

- Always use semantic roles.
- Never hardcode arbitrary colors.
- Avoid introducing new color families.
- Use color intentionally.
- Preserve visual consistency.

---

# Typography

Typography is one of the most important aspects of the PlateUp experience.

Clear typography creates trust and improves usability.

---

## Typeface

Primary Typeface:

Inter

Fallback:

System Sans Serif

---

# Type Scale

| Token | Size | Weight |
|---------|---------|---------|
| Display | 60px | 500 |
| H1 | 32px | 500 |
| H2 | 28px | 500 |
| Body | 16px | 400 |
| Body Small | 14px | 400 |
| Label | 12px | 500 |
 
---

# Typography Usage

## Display

Use for:

- Major page titles
- Hero content

---

## H1

Use for:

- Page headings
- Major sections

---

## H2

Use for:

- Section headings
- Card headings

---

## Body

Use for:

- General content
- Descriptions
- Forms

---

## Body Small

Use for:

- Labels
- Secondary content

---

## Caption

Use for:

- Metadata
- Timestamps
- Supporting details

---

# Typography Rules

- Maintain hierarchy.
- Avoid unnecessary font sizes.
- Use typography consistently.
- Prioritize readability.
- Avoid decorative text treatments.

---

# Spacing System

PlateUp uses a tokenized spacing scale.

All layouts should use approved spacing tokens.

---

# Spacing Scale

| Token | Value |
|---------|---------|
| space-0 | 0 |
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-5 | 24 |
| space-6 | 32 |
| space-7 | 40 |
| space-8 | 48 |
| space-9 | 64 |
| space-10 | 80 |
| space-11 | 96 |

---

# Spacing Rules

- Use spacing tokens whenever possible.
- Avoid hardcoded spacing values.
- Use consistent spacing patterns.
- Prioritize readability over density.
- Maintain generous whitespace.

---

# Layout System

Layouts should prioritize clarity and usability.

Users should focus on content rather than navigation complexity.

---

## Responsive Strategy

Supported layouts:

- Mobile
- Tablet
- Desktop

Design responsively from the start.

---

## Content Width

Content should remain readable on large screens.

Avoid excessively wide content areas.

---

## Auth Layout Rules

Authentication experiences should feel focused and simple.

Avoid unnecessary distractions.

---

## Dashboard Layout Rules

The dashboard should feel like a unified application.

Navigation should remain predictable and easy to understand.

Use consistent layout patterns throughout the application.


# Component Strategy

PlateUp uses a custom design system.

shadcn/ui may be used as a component foundation.

Visual styling must follow the PlateUp Design System.

Do not rely on default shadcn/ui styling.

All reusable primitives should live inside:

```text
components/ui/
```

Prefer extending existing components before creating new component patterns.

---

# Component Guidelines

Components should follow:

- Approved color roles
- Typography scale
- Spacing scale
- Accessibility requirements
- Design token rules

Components should remain visually consistent across the application.

Avoid creating multiple patterns that solve the same problem.

---

# Button Guidelines

Buttons communicate actions.

Button styling must follow:

- Color roles
- Typography system
- Spacing system
- Accessibility requirements

---

## Button Usage

Primary buttons should be reserved for the most important action on a screen.

Examples:

- Generate Meal Plan
- Save Meal Plan
- Continue
- Complete Onboarding

Avoid placing multiple primary buttons in the same visual area.

---

## Button Rules

- Maintain consistent padding.
- Maintain consistent heights.
- Use approved color roles.
- Preserve clear visual hierarchy.
- Ensure touch-friendly sizing.

Minimum touch target:

```text
44px
```

---

# Input Guidelines

Forms should prioritize clarity.

Labels should always be visible.

Placeholder text should support the label, not replace it.

---

## Input Rules

Inputs should:

- Follow spacing tokens.
- Follow typography tokens.
- Follow accessibility requirements.
- Maintain consistent sizing.

Minimum input height:

```text
44px
```

---

## Validation

Validation should occur:

- Client-side
- Server-side

Validation messages should be:

- Clear
- Human-readable
- Actionable

---

# Form Design Guidelines

Forms are critical to the PlateUp experience.

Examples:

- Sign Up
- Login
- Password Reset
- Onboarding
- Meal Generation

---

## Form Rules

- Group related fields together.
- Minimize unnecessary inputs.
- Prioritize readability.
- Avoid overwhelming users.

Users should understand what is required at a glance.

---

# Card Guidelines

Cards are used throughout PlateUp.

Examples:

- Meal Plans
- Saved Plans
- Meal History
- Dashboard Sections

Cards should prioritize:

- Readability
- Structure
- Information hierarchy

before decoration.

---

## Card Rules

Use:

- Surface roles
- Surface containers
- Borders
- Spacing

before introducing visual elevation.

Avoid excessive shadows.

---

# Dashboard Design Guidelines

The dashboard should feel like a single application experience.

Users should move between features without feeling like they are navigating separate applications.

---

## Dashboard Views

Examples:

- Generate Meal Plan
- Meal History
- Saved Plans
- Profile
- Settings

Use conditional rendering where appropriate.

Avoid unnecessary page transitions.

---

## Dashboard Content Rules

Prioritize:

- Readability
- Scanability
- Clear hierarchy

Users should immediately understand:

- Current budget
- Meal plan information
- Saved plans
- Available actions

---

# Budget Status Indicator

Budget awareness is a core PlateUp feature.

Supported states:

- Within Budget
- Approaching Budget Limit
- Exceeded Budget

Do not rely on color alone.

Always combine:

- Color
- Text
- Context

to communicate status.

---

# AI Meal Planning UX

Meal generation is the primary workflow.

The experience should feel:

- Fast
- Helpful
- Predictable
- Trustworthy

---

## Meal Plan Presentation

Meal plans should clearly display:

- Breakfast
- Lunch
- Dinner

for each day.

Information should be easy to scan.

---

## Shopping List Presentation

Shopping lists should:

- Be easy to scan
- Group related items
- Be easy to share

Reduce cognitive effort wherever possible.

---

## Meal History Presentation

Users should easily:

- View
- Reuse
- Delete

saved meal plans.

Actions should remain obvious and accessible.

---

# Loading States

Loading states should communicate progress.

Avoid blank screens.

Use:

- Skeletons
- Loading Indicators
- Progress Feedback

where appropriate.

---

# Empty States

Empty states should guide users.

Examples:

- No Meal Plans Yet
- No Saved Plans Yet
- No Meal History Yet

Every empty state should provide:

- Context
- Explanation
- Recommended next action

---

# Notification Design

Notifications should be concise.

Examples:

- Meal Plan Generated
- Meal Plan Saved
- Meal Plan Deleted
- Verification Email Sent
- Password Reset Sent

Avoid excessive notifications.

---

# Iconography

Preferred icon library:

```text
Lucide React
```

Do not mix icon libraries.

---

## Icon Rules

Navigation Icons:

```text
24px
```

Button Icons:

```text
20px
```

Inline Icons:

```text
16px
```

Icons should support content rather than replace it.

---
# Source Of Truth

The following documents are the source of truth:

- PRD
- AGENTS.md
- ARCHITECTURE.md
- DESIGN_SYSTEM.md

Design decisions should align with approved project documentation.

---

# What Not To Do

- Do not introduce additional color systems.
- Do not introduce additional typefaces.
- Do not hardcode spacing values when tokens exist.
- Do not introduce unnecessary visual effects.
- Do not rely on color alone to communicate information.
- Do not create component styles that conflict with the design system.
- Do not mix icon libraries.
- Do not bypass design tokens.
- Do not create inconsistent UI patterns across the application.