import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatKD(value: number): string {
  return value.toFixed(2);
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getResultColor(result: string): string {
  return result === 'EXTRACTED' ? 'text-accent-primary' : 'text-accent-danger';
}

export function getResultBadgeClasses(result: string): string {
  const base = 'px-2 py-0.5 text-xs font-mono uppercase border';
  return result === 'EXTRACTED'
    ? `${base} bg-accent-primary/10 border-accent-primary/30 text-accent-primary`
    : `${base} bg-accent-danger/10 border-accent-danger/30 text-accent-danger`;
}
