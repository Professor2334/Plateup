# Database Migration Runner Skill

Load this skill whenever changing the database schema, creating a model, modifying a model, adding indexes, introducing constraints, or performing data migrations in PlateUp.

Database changes are high-risk operations.

Every schema change must be treated carefully.

Always follow:

- AGENTS.md
- ARCHITECTURE.md
- SECURITY.md

before making database changes.

---

# The Stack

PlateUp uses:

```text
PostgreSQL
Prisma ORM
Neon Database
```

Schema Location:

```text
prisma/schema.prisma
```

Migration Location:

```text
prisma/migrations/
```

Prisma Client:

```text
lib/db.ts
```

---

# Migration Workflow

Every schema change follows the same workflow.

1. Update schema.prisma
2. Generate migration
3. Review migration
4. Test locally
5. Commit schema and migration together
6. Deploy migration

---

# Migration Commands

Development:

```bash
npx prisma migrate dev --name <migration_name>
```

Generate Client:

```bash
npx prisma generate
```

Production:

```bash
npx prisma migrate deploy
```

---

# Migration Naming

Use descriptive snake_case names.

Examples:

```text
add_user_onboarding_fields

add_meal_plan_table

add_budget_column

add_meal_history_indexes

add_saved_plan_support
```

Avoid:

```text
update_schema

fix_database

migration_1
```

---

# Safe Changes

Safe changes include:

- New nullable fields
- New tables
- New indexes
- New relationships

These usually have low risk.

---

# Non-Nullable Fields

Adding required fields to existing tables is risky.

Use the expand-contract pattern.

Step 1:

Add field as nullable.

Step 2:

Backfill existing records.

Step 3:

Convert field to required.

---

# Unique Constraints

Before adding a unique constraint:

Verify existing data contains no duplicates.

Examples:

```prisma
email String @unique
```

Migration failures commonly occur when duplicate data already exists.

---

# Indexes

Indexes improve query performance.

Only add indexes for real query needs.

Examples:

```prisma
@@index([createdAt])

@@index([userId])
```

Avoid unnecessary indexes.

Indexes increase write costs.

---

# Data Migrations

Schema migrations and data migrations are different.

Schema changes:

```text
Prisma Migrations
```

Data changes:

```text
Scripts
```

Use version-controlled scripts for data transformations.

Never run ad-hoc production SQL.

---

# Database Ownership

PlateUp is multi-user.

Ownership must be preserved.

Examples:

- Meal Plans belong to Users
- Meal History belongs to Users
- Saved Plans belong to Users

Schema changes must preserve ownership relationships.

---

# Existing Core Models

Core MVP models include:

```text
User
MealPlan
```

Do not remove or fundamentally redesign core models without approval.

---

# Rollback Strategy

Prisma does not generate down migrations.

Rollback strategy:

```text
Write a new migration that reverses the change.
```

Always think about rollback before deploying.

---

# Testing

After every migration:

- Generate Prisma Client
- Run application locally
- Test affected features
- Verify data integrity

Never deploy untested migrations.

---

# Common Mistakes

- Editing applied migrations.
- Forgetting migration files.
- Adding required fields without backfills.
- Creating unnecessary indexes.
- Breaking ownership relationships.
- Running development commands against production.
- Skipping migration review.