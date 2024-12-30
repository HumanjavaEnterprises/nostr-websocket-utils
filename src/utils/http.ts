/**
 * @file HTTP utility functions
 * @module utils/http
 */

import { getLogger } from './logger';

const logger = getLogger('http');

/**
 * Fetches JSON data from a URL
 * @param url URL to fetch from
 * @returns Parsed JSON data
 */
export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    logger.error({ error, url }, 'Failed to fetch JSON');
    throw error;
  }
}
