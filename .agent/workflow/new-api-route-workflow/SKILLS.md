# New API Route Workflow

Load this workflow whenever creating or modifying:

```text
app/api/**/route.ts
```

in PlateUp.

PlateUp follows a Server Actions First architecture.

Always determine whether a Route Handler is actually required before creating one.

Always read:

- AGENTS.md
- ARCHITECTURE.md
- SECURITY.md
- CODE_STYLE.md
- skills/api-route-scalffolder/SKILLS.md

before implementing routes.

---

# Step 1: Decide If A Route Is Needed

Ask:

```text
Can this be implemented as a Server Action?
```

If yes:

Use a Server Action.

If no:

Create a Route Handler.

Server Actions remain the preferred backend pattern.

---

# Step 2: Define Route Purpose

Document:

```text
What does this route do?

Who calls it?

Why can't a Server Action handle it?
```

The purpose should be clear before implementation.

---

# Step 3: Define Input Schema

Create a Zod schema.

Validate:

- Request Body
- Query Parameters
- Route Parameters

Never trust incoming data.

---

# Step 4: Determine Authentication Requirements

Ask:

```text
Does this route require authentication?
```

If yes:

Validate the session before doing any work.

---

# Step 5: Determine Authorization Requirements

Ask:

```text
Can this user access this resource?
```

Ownership validation is mandatory.

Examples:

- Meal Plans
- Meal History
- Saved Plans
- Profile Data

---

# Step 6: Implement Business Logic

Keep route handlers small.

Move complex logic into:

```text
lib/
```

Route handlers should coordinate actions.

They should not contain large business workflows.

---

# Step 7: Handle Errors

Wrap logic in:

```ts
try/catch
```

Return structured errors.

Never expose:

- Stack Traces
- Prisma Errors
- Internal Exceptions

Use sanitized messages.

---

# Step 8: Define Response Shape

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

Use consistent responses everywhere.

---

# Step 9: Add Logging

Log:

- Route
- User ID
- Duration
- Error Context

Never log:

- Passwords
- Tokens
- Secrets
- API Keys

---

# Step 10: Apply Rate Limiting

If the route is public:

Apply rate limiting.

Examples:

- Login
- Signup
- Password Reset
- Email Verification

Use Upstash.

---

# Step 11: Security Review

Verify:

- Authentication
- Authorization
- Validation
- Ownership Checks
- Error Handling
- Rate Limiting

All security requirements must pass.

---

# Step 12: Final Validation

Before completion verify:

- Route is actually necessary.
- Server Action was not a better option.
- Validation exists.
- Ownership checks exist.
- Error handling exists.
- Logging exists.
- Security requirements are satisfied.

Only then should implementation be considered complete.

---

# Common Mistakes

- Creating unnecessary Route Handlers.
- Skipping validation.
- Skipping ownership checks.
- Returning raw errors.
- Putting business logic inside routes.
- Forgetting authentication.
- Forgetting rate limiting.
- Forgetting logging.
- Trusting AI responses blindly.
