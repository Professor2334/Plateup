import { Prisma } from '@prisma/client';

export function handleActionError(error: unknown, fallbackMessage = "An unexpected error occurred. Please try again in a moment."): string {
  // 1. Keep original error in server logs for debugging
  console.error('[Action Error Log]:', error);

  // 2. Centralized categorization
  if (error instanceof Error) {
    const message = error.message;

    // AI/DeepSeek failure
    if (message.includes('DeepSeek') || message.includes('AI response') || message.includes('API request timed out')) {
      return "We're having trouble generating your meal plan right now. Please try again in a moment.";
    }

    // Rate limits
    if (message.includes('RATE_LIMIT_EXCEEDED') || message.includes('rate limit') || message.includes('Too many requests')) {
      return "You've reached your daily meal plan limit (10/10). Please try again tomorrow.";
    }

    // Validation
    if (message.includes('validation') || message.includes('invalid') || message.includes('ZodError')) {
      return "The details you provided seem incorrect. Please check your inputs and try again.";
    }

    // Network / Timeout
    if (message.includes('fetch') || message.includes('network') || message.includes('timeout') || message.includes('AbortError')) {
      return "We couldn't connect to our services. Please check your internet connection and try again.";
    }
  }

  // Database Errors (Prisma)
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    return "A system error occurred. We're on it, please try again in a moment.";
  }

  return fallbackMessage;
}
