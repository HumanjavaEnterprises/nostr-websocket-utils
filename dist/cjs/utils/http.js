"use strict";
/**
 * @file HTTP utilities
 * @module utils/http
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = fetchJson;
const logger_js_1 = require("./logger.js");
const logger = (0, logger_js_1.getLogger)('http');
/**
 * Fetches JSON data from a URL
 * @param url URL to fetch from
 * @returns Parsed JSON data
 */
async function fetchJson(url) {
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