'use client';

import { cn } from '@/lib/utils';

interface ToggleSwitchProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleSwitch<T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleSwitchProps<T>) {
  return (
    <div className={cn('inline-flex border border-border bg-background-elevated overflow-x-auto hide-scrollbar max-w-full', className)}>
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-2.5 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-150 focus-accent whitespace-nowrap',
            'border-r border-border last:border-r-0',
            value === option.value
              ? 'bg-background-surface text-text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-surface/50'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
