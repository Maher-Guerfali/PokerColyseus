// This file provides type declarations for modules that don't have their own types
declare module 'dotenv' {
  export function config(options?: { path?: string }): { parsed?: { [key: string]: string } };
  export const parsed: { [key: string]: string } | undefined;
}
