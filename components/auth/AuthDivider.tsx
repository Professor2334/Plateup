export function AuthDivider() {
  return (
    <div
      className="flex items-center gap-[var(--space-4)] my-[var(--space-4)]"
      role="separator"
      aria-label="Or continue with email"
    >
      <div className="flex-1 h-px bg-outline-variant opacity-80" />
      <span className="text-label-medium text-on-surface-variant opacity-70 shrink-0 select-none">
        OR
      </span>
      <div className="flex-1 h-px bg-outline-variant opacity-80" />
    </div>
  );
}
