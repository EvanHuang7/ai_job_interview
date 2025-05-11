import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cleans up resume or job description text for LLM input.
 * - Replaces non-breaking spaces with regular spaces
 * - Trims extra whitespace
 * - Removes HTML tags if accidentally included
 * - Normalizes special quotes and dashes
 */
export function sanitizeText(raw: string): string {
  return raw
      .replace(/\u00A0/g, " ")                      // Replace non-breaking space
      .replace(/<\/?[^>]+(>|$)/g, "")               // Strip HTML tags
      .replace(/[“”]/g, '"')                        // Normalize fancy quotes
      .replace(/[‘’]/g, "'")                        // Normalize fancy apostrophes
      .replace(/[\u2013\u2014]/g, "-")              // Normalize dashes
      .replace(/\r\n|\r/g, "\n")                    // Normalize line breaks
      .replace(/[ \t]+/g, " ")                      // Collapse horizontal whitespace
      .replace(/\n{2,}/g, "\n\n")                   // Limit consecutive newlines
      .trim();
}