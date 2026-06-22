-- Migration: add_multi_goal_support
-- Converts primaryGoal from a nullable TEXT column to a TEXT[] array.
-- Existing single-value goals are preserved by wrapping them in an array.
-- Existing NULL values become an empty array (defaulting to ['save-money'] in application code).

-- Step 1: Add the new array column
ALTER TABLE "User" ADD COLUMN "primaryGoal_new" TEXT[] NOT NULL DEFAULT '{}';

-- Step 2: Migrate existing data — wrap the old single string value into an array
UPDATE "User" SET "primaryGoal_new" = ARRAY["primaryGoal"] WHERE "primaryGoal" IS NOT NULL AND "primaryGoal" != '';

-- Step 3: Drop the old column
ALTER TABLE "User" DROP COLUMN "primaryGoal";

-- Step 4: Rename the new column to the original name
ALTER TABLE "User" RENAME COLUMN "primaryGoal_new" TO "primaryGoal";
