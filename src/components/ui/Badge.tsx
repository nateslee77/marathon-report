import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-background-surface border-border text-text-secondary',
    success: 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary',
    danger: 'bg-accent-danger/10 border-accent-danger/30 text-accent-danger',
    warning: 'bg-accent-warning/10 border-accent-warning/30 text-accent-warning',
    info: 'bg-accent-info/10 border-accent-info/30 text-accent-info',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono uppercase border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
