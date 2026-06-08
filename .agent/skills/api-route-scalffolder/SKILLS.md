# API Route Handler Skill

Load this skill whenever creating or modifying:

```text
app/api/**/route.ts
```

or implementing Route Handlers in PlateUp.

PlateUp follows a Server Actions First architecture.

Route Handlers should only be used when Server Actions are not appropriate.

Always follow:

- AGENTS.md
- ARCHITECTURE.md
- SECURITY.md
- CODE_STYLE.md

before creating routes.

---

# Before You Start

Ask:

```text
Can this be a Server Action?
```

If yes:

Use a Server Action.

If no:

Use a Route Handler.

---

# When To Use Route Handlers

Appropriate use cases:

- Auth.js requirements
- Third-party integrations
- External callbacks
- Public endpoints

Avoid creating Route Handlers for internal dashboard mutations.

---

# Route Structure

Route Handlers live inside:

```text
app/api/
```

Example:

```text
app/api/auth/
```

---

# Standard Route Template

Every route should include:

1. Validation
2. Authentication
3. Authorization
4. Business Logic
5. Structured Response

Keep route handlers small.

Move large business logic into:

```text
lib/
```

---

# Input Validation

All external input must be validated.

Use:

```text
Zod
```

for validation.

Validate:

- Request Body
- Query Parameters
- Route Parameters

Never trust incoming data.

---

# Authentication

Authenticate before authorizing.

Examples:

```text
Check Session
↓
Check Permissions
↓
Execute Logic
```

Never skip ownership validation.

---

# Ownership Validation

Users may only access their own data.

Examples:

- Meal Plans
- Saved Plans
- Meal History
- Profile Data

Ownership checks are mandatory.

---

# Response Structure

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

Maintain consistency across all routes.

---

# HTTP Status Codes

Use:

```text
200 Success

201 Created

400 Invalid Input

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

429 Rate Limited

500 Server Error
```

Use appropriate status codes.

---

# Error Handling

Use try/catch around:

- Database Calls
- External Services
- JSON Parsing

Never expose:

- Prisma Errors
- Stack Traces
- Internal Exceptions

Return sanitized messages.

---

# Logging

Log structured information.

Examples:

```text
Route
UserId
Action
Duration
Error
```

Do not log sensitive information.

Never log:

- Passwords
- Tokens
- Secrets
- API Keys

---

# Rate Limiting

Public endpoints should be rate limited.

Examples:

- Login
- Signup
- Password Reset
- Email Verification

Use:

```text
Upstash
```

for production rate limiting.

---

# AI Integration Routes

Routes interacting with DeepSeek should:

1. Validate Request
2. Validate Response
3. Handle Failures Gracefully

Never trust AI responses automatically.

---

# Server Actions Relationship

Remember:

```text
Server Actions
=
Primary Backend Pattern

Route Handlers
=
Secondary Pattern
```

Expected architecture:

```text
80–90% Server Actions

10–20% Route Handlers
```

---

# Common Mistakes

- Using Route Handlers unnecessarily.
- Skipping validation.
- Skipping ownership checks.
- Returning raw errors.
- Putting business logic inside routes.
- Forgetting rate limits.
- Forgetting authentication.
- Trusting AI responses blindly.
- Creating inconsistent response structures.