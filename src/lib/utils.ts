import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRemainingTime(reservedAt: string | null | undefined): { minutes: number; seconds: number; isExpired: boolean } {
  if (!reservedAt) return { minutes: 0, seconds: 0, isExpired: true };
  const reservedTime = new Date(reservedAt).getTime();
  const expiresTime = reservedTime + 60 * 60 * 1000; // 1 hour
  const now = Date.now();
  const diff = expiresTime - now;

  if (diff <= 0) {
    return { minutes: 0, seconds: 0, isExpired: true };
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { minutes, seconds, isExpired: false };
}
