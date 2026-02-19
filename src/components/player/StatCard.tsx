import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
}

export function StatCard({ label, value, sublabel, variant = 'default', className }: StatCardProps) {
  const variantClasses = {
    default: 'text-text-primary',
    success: 'text-accent-primary',
    danger: 'text-accent-danger',
    warning: 'text-accent-warning',
  };

  return (
    <div className={cn('game-card p-4', className)}>
      <div className="stat-label mb-2">{label}</div>
      <div className={cn('text-xl font-stat font-semibold tabular-nums', variantClasses[variant])}>
        {value}
      </div>
      {sublabel && (
        <div className="text-xs text-text-secondary mt-1">{sublabel}</div>
      )}
    </div>
  );
}
