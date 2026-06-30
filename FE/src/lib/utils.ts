import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDummyProductStats(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  // Rating between 4.0 and 5.0
  const rating = (4 + (sum % 11) / 10).toFixed(1);
  // Sold between 20 and 700
  const sold = 20 + (sum % 681);
  return { rating, sold };
}
