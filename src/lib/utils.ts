import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Percentiles } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePercentiles(responseTimes: number[]): Percentiles {
  responseTimes.sort((a, b) => a - b);
  const percentiles = (p: number) => {
    const idx = Math.ceil(p * responseTimes.length) - 1;
    return responseTimes[idx];
  };
  
  return {
    p50: percentiles(0.5),
    p75: percentiles(0.75),
    p90: percentiles(0.9),
    p95: percentiles(0.95),
    p99: percentiles(0.99),
  };
}