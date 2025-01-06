/**
 * @file HTTP utilities
 * @module utils/http
 */
import { getLogger } from './logger.js';
const logger = getLogger('http');
/**
 * Fetches JSON data from a URL
 * @param url URL to fetch from
 * @returns Parsed JSON data
 */
export async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        logger.error({ error, url }, 'Failed to fetch JSON');
        throw error;
    }
}
//# sourceMappingURL=http.js.map