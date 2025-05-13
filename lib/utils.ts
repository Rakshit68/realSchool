import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Wrapper for fetch that handles HTTPS requests to our API
export async function apiFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url.replace('https://', 'http://'), {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: text
      });
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}
