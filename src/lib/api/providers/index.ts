import { coreProvider } from './core';
import type { DataProvider, ProviderRegistry } from './types';
import { DEFAULT_PROVIDER } from './types';

/**
 * Registry of all available data providers
 */
const providers: ProviderRegistry = {
  core: coreProvider,
};

/**
 * Get a data provider by name
 * @param name - Provider name (defaults to DEFAULT_PROVIDER)
 * @returns The data provider configuration
 * @throws Error if provider is not found
 */
export function getProvider(name: string = DEFAULT_PROVIDER): DataProvider {
  const provider = providers[name];

  if (!provider) {
    throw new Error(
      `Unknown data provider: "${name}". Available providers: ${Object.keys(providers).join(', ')}`
    );
  }

  return provider;
}

/**
 * Check if a provider exists
 * @param name - Provider name to check
 * @returns True if provider exists
 */
export function hasProvider(name: string): boolean {
  return name in providers;
}

/**
 * Get list of available provider names
 * @returns Array of provider names
 */
export function getProviderNames(): string[] {
  return Object.keys(providers);
}

// Re-export types and constants
export type { DataProvider, ProviderRegistry, PaginationType } from './types';
export { DEFAULT_PROVIDER } from './types';
