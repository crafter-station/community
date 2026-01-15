import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if an image URL is a local development URL
 * Used to disable Next.js image optimization for local images
 */
export function isLocalImageUrl(url: string): boolean {
  return url.includes("127.0.0.1") || url.includes("localhost")
}
