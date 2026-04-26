// Common type definitions to replace 'any' types

export type UnknownObject = Record<string, unknown>;
export type UnknownArray = unknown[];
export type AnyFunction = (...args: unknown[]) => unknown;
export type ErrorWithMessage = { message: string; [key: string]: unknown };

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Form data types
export type FormData = Record<string, string | number | boolean | null | undefined>;

// Generic error type
export interface GenericError {
  message: string;
  code?: string | number;
  details?: unknown;
}
