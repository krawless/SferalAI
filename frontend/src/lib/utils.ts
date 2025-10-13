import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Decimal from 'decimal.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Decimal.js utilities for precise math operations
export function formatDecimal(value: number | string | Decimal, decimals: number = 2): string {
  const decimal = new Decimal(value);
  return decimal.toFixed(decimals);
}

export function addDecimal(a: number | string | Decimal, b: number | string | Decimal): Decimal {
  return new Decimal(a).plus(b);
}

export function subtractDecimal(
  a: number | string | Decimal,
  b: number | string | Decimal
): Decimal {
  return new Decimal(a).minus(b);
}

export function multiplyDecimal(
  a: number | string | Decimal,
  b: number | string | Decimal
): Decimal {
  return new Decimal(a).times(b);
}

export function divideDecimal(a: number | string | Decimal, b: number | string | Decimal): Decimal {
  return new Decimal(a).dividedBy(b);
}

export function toNumber(value: Decimal): number {
  return value.toNumber();
}
