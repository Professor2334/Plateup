---
trigger: always_on
---

# SECURITY.md

This document defines the security rules for PlateUp.

All developers and AI coding agents must follow these rules when building features, handling user data, and interacting with external services.

---

# Secrets And Configuration

Never commit secrets to the repository.

Secrets must only exist in environment variables.

Required environment variables include:

```env
DATABASE_URL

AUTH_SECRET
AUTH_URL

RESEND_API_KEY
EMAIL_FROM

DEEPSEEK_API_KEY

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Environment variables should be validated during application startup.

The application should fail fast if required configuration is missing.

Only variables prefixed with:

```env
NEXT_PUBLIC_
```

may be exposed to the browser.

Never expose:

- API Keys
- Database Credentials
- Auth Secrets
- Redis Credentials
- Email Credentials

to the client.

---

# Authentication

Authentication uses Auth.js.

Passwords must be hashed using:

```text
bcrypt
```

before storage.

Never store plaintext passwords.

Never log passwords.

---

# Email Verification

Email verification is mandatory.

User flow:

```text
Sign Up
→ Verification Email
→ Email Verification
→ Login
→ Onboarding
→ Application Access
```

Users who have not verified their email may not access protected functionality.

---

# Session Security

Sessions are cookie-based.

Cookies should be:

```text
httpOnly
secure (production)
sameSite=lax
```

Session validation must occur on the server.

Never trust client-side session state.

---

# Authorization

Authentication and authorization are different.

Being logged in does not automatically grant access.

Users may only access their own:

- Meal Plans
- Saved Plans
- Meal History
- Profile Data

Ownership validation is mandatory.

---

# Input Validation

All external input must be validated.

Use:

```text
Zod
```

for validation.

Validation applies to:

- Form Inputs
- Search Parameters
- URL Parameters
- Query Strings
- AI Requests
- Environment Variables

Server-side validation is mandatory.

---

# Database Security

All database access must go through Prisma.

Import Prisma from:

```text
lib/db.ts
```

Do not create multiple Prisma clients.

---

# SQL Injection

Prisma protects against SQL injection when used correctly.

Never use:

```ts
prisma.$queryRawUnsafe()
```

Never concatenate SQL strings.

If raw SQL is required, use parameterized queries.

---

# Cross Site Scripting (XSS)

React escapes content by default.

Avoid:

```tsx
dangerouslySetInnerHTML
```

unless absolutely necessary.

Never trust user-generated content.

Sanitize content before rendering.

---

# Cross Site Request Forgery (CSRF)

Server Actions provide built-in CSRF protection.

Route Handlers that modify data should validate request origin.

Verify:

- Origin
- Referer

when appropriate.

---

# AI Security

DeepSeek is an external service.

AI output should never be trusted automatically.

Always validate AI responses before:

- Saving to the database
- Displaying content
- Processing application logic

---

# AI Response Validation

Validate:

- Structure
- Required Fields
- Expected Types

before storage.

Malformed AI responses should be rejected gracefully.

---

# Prompt Security

Never include:

- Secrets
- API Keys
- Internal Configuration
- Sensitive User Data

inside prompts.

Only send information required for meal generation.

---

# Rate Limiting

Rate limiting is mandatory.

Apply rate limits to:

- Login
- Sign Up
- Email Verification Requests
- Password Reset Requests
- Meal Generation Requests

Use:

```text
Upstash
```

for production rate limiting.

---

# Email Security

Email delivery uses:

```text
Resend
```

as the primary provider.

Do not expose email infrastructure or API keys to clients.

---

# Logging

Log enough information to debug issues.

Do not log sensitive information.

Never log:

- Passwords
- Session Tokens
- Auth Secrets
- API Keys
- Verification Tokens
- Password Reset Tokens

---

# Error Handling

Never expose internal errors to users.

Do not return:

- Stack Traces
- Database Errors
- Prisma Errors
- Internal Exceptions

Return sanitized error messages instead.

---

# Dependency Security

Every dependency introduces risk.

Keep dependencies minimal.

Regularly review:

```text
npm audit
```

Avoid unmaintained packages.

---

# Database Ownership Rules

Every database operation involving user data must verify ownership.

Examples:

- View Meal Plan
- Delete Meal Plan
- Reuse Meal Plan
- View Meal History

Users may never access another user's data.

Ownership validation is mandatory.

---

# Production Security

Production secrets must never be stored:

- In source code
- In Git commits
- In screenshots
- In documentation

Use secure environment variables.

---

# Incident Response

If a secret is exposed:

1. Rotate the secret immediately.
2. Update environment variables.
3. Redeploy the application.
4. Revoke the old secret.
5. Document the incident.

Never attempt to hide a security incident.

---

# What Not To Do

- Do not store plaintext passwords.
- Do not bypass authentication.
- Do not bypass authorization checks.
- Do not bypass ownership validation.
- Do not expose secrets to the client.
- Do not trust AI responses blindly.
- Do not trust client-side validation.
- Do not use unsafe raw SQL.
- Do not expose internal errors.
- Do not commit secrets to Git.
- Do not disable security checks for convenience.