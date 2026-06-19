import { toast } from 'sonner';

export const Feedback = {
  error: {
    generation: () => toast.error('Unable to generate your meal plan right now. Please try again in a few moments.'),
    rateLimit: () => toast.error("You've reached your daily meal plan limit (10/10). Please try again tomorrow."),
    network: () => toast.error('Connection lost. Please check your internet connection and try again.'),
    auth: () => toast.error('Your session has expired. Please sign in again.'),
    save: () => toast.error('Unable to save your meal plan. Please try again.'),
    reset: () => toast.error('We couldn’t process your request. Please try again later.'),
    verification: () => toast.error('We couldn’t send your verification email right now. Please try again later.'),
    unexpected: () => toast.error('Something went wrong. Please try again.')
  },
  success: {
    generated: () => toast.success('Your meal plan is ready.'),
    saved: () => toast.success('Meal plan saved successfully.'),
    verificationSent: () => toast.success('Verification email sent successfully.'),
    resetSent: () => toast.success('Password reset link sent to your email.')
  },
  loading: {
    generate: 'Generating meal plan...',
    save: 'Saving plan...',
    login: 'Signing in...',
    signup: 'Creating account...',
    reset: 'Sending reset link...'
  },
  empty: {
    history: 'No meal plans yet. Generate your first meal plan to get started.',
    saved: 'You haven’t saved any meal plans yet.',
    support: 'No support requests found.'
  }
};
