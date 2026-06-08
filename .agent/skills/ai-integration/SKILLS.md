# AI Integration Skill

Load this skill whenever implementing, modifying, debugging, or optimizing any AI-related functionality in PlateUp.

This skill governs how PlateUp interacts with DeepSeek and how AI-generated content is validated, processed, stored, and displayed.

Always follow:

- AGENTS.md
- ARCHITECTURE.md
- SECURITY.md
- CODE_STYLE.md

before implementing AI functionality.

---

# Purpose

PlateUp relies on AI to generate:

- Meal Plans
- Shopping Lists
- Budget-Aware Recommendations

AI is a core product dependency.

AI responses must never be trusted blindly.

Every response must be validated before use.

---

# AI Provider

Current Provider:

```text
DeepSeek
```

All AI interactions should be abstracted behind a dedicated service layer.

Example:

```text
lib/ai/
```

Do not call AI providers directly from:

```text
Components
Pages
Route Handlers
```

---

# Architecture

Preferred flow:

```text
User Input
↓
Validation
↓
Server Action
↓
AI Service
↓
Response Validation
↓
Database
↓
UI
```

AI logic should remain server-side.

Never expose API keys to the client.

---

# AI Service Layer

AI requests should be centralized.

Example:

```text
lib/ai/client.ts
lib/ai/generateMealPlan.ts
```

Avoid duplicating AI request logic.

Use a single source of truth.

---

# Prompt Management

Prompts should be managed separately from application logic.

Recommended structure:

```text
ai/
├── SYSTEM_PROMPT.md
├── OUTPUT_SCHEMA.md
```

Avoid hardcoding large prompts inside business logic.

Prompt updates should not require application refactoring.

---

# Input Validation

Validate all user input before sending it to AI.

Examples:

- Budget
- Household Size
- Available Ingredients
- User Goals

Never send invalid input to the model.

---

# Output Validation

All AI responses must be validated.

Never assume AI output is correct.

Validate:

- Structure
- Required Fields
- Data Types
- Expected Format

Reject malformed responses.

---

# Structured Output

AI responses should follow a predictable schema.

Preferred:

```json
{
  "mealPlan": [],
  "shoppingList": [],
  "budgetStatus": ""
}
```

Avoid free-form responses whenever possible.

Structured responses reduce failures.

---

# JSON Parsing

AI output parsing should be defensive.

Handle:

- Invalid JSON
- Missing Fields
- Unexpected Fields
- Empty Responses

Gracefully recover from failures.

Never crash the application because AI returned malformed data.

---

# Error Handling

Handle:

- Timeouts
- Rate Limits
- Provider Failures
- Network Errors
- Invalid Responses

Return user-friendly messages.

Never expose raw AI errors to users.

---

# Retry Strategy

Retry only when appropriate.

Examples:

- Temporary Provider Failure
- Network Failure
- Timeout

Do not retry:

- Invalid Input
- Validation Failures

Avoid infinite retry loops.

---

# Timeouts

AI requests must have timeouts.

Do not allow requests to hang indefinitely.

Fail gracefully when timeout thresholds are exceeded.

---

# Rate Limiting

Meal generation endpoints should be rate limited.

Prevent:

- Abuse
- Excessive API Costs
- Resource Exhaustion

Use Upstash for production rate limiting.

---

# Cost Awareness

AI usage creates operational costs.

Avoid unnecessary requests.

Examples:

- Duplicate Requests
- Regeneration Loops
- Repeated Identical Queries

Generate only when necessary.

---

# Caching

Cache AI responses when appropriate.

Potential cache candidates:

- Identical Requests
- Repeated Meal Generations

Do not cache user-specific sensitive information improperly.

---

# Security

Never send:

- API Keys
- Secrets
- Session Tokens
- Internal Configuration

inside prompts.

Only send information required for meal generation.

---

# Logging

Log:

- Request Duration
- Success
- Failure
- Validation Errors

Do not log:

- Secrets
- API Keys
- Full User Data

Protect user privacy.

---

# Monitoring

Track:

- Generation Success Rate
- Generation Failure Rate
- Response Time
- Retry Count
- Validation Failures

These metrics help maintain AI reliability.

---

# Meal Generation Rules

The AI provider is responsible for generation.

The application is responsible for validation.

Never assume generated content is safe, correct, or usable.

Always verify output before:

- Saving
- Displaying
- Reusing

---

# Testing

Test AI integrations for:

- Success Cases
- Invalid Responses
- Empty Responses
- Timeouts
- Rate Limits
- Provider Failures

AI functionality should fail gracefully.

---

# Common Mistakes

- Calling AI directly from components.
- Hardcoding prompts in business logic.
- Trusting AI output blindly.
- Skipping response validation.
- Exposing API keys.
- Ignoring timeout handling.
- Ignoring retry logic.
- Storing malformed responses.
- Returning raw provider errors.
- Building AI features without structured outputs.