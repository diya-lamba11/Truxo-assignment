/**
 * @fileoverview Custom hook that fetches student search results from the backend API.
 * Handles loading state, minimum character enforcement, and request cancellation
 * to prevent stale responses from overwriting newer results.
 */

import { useState, useEffect } from "react";

/**
 * useStudentSearch — performs an API search whenever `query` changes.
 *
 * - Skips the fetch if the trimmed query has fewer than `minChars` characters.
 * - Uses a `cancelled` flag to avoid race conditions when rapid queries overlap.
 *
 * @param {string} query - The search query (typically the debounced input value)
 * @param {number} [minChars=3] - Minimum characters required before fetching
 * @returns {{ results: Array<{name: string, class: number, rollNumber: number}>, loading: boolean }}
 *   - `results` — array of matching student objects (max 5 from API)
 *   - `loading` — true while a fetch is in progress
 *
 * @example
 * const { results, loading } = useStudentSearch(debouncedQuery);
 */
export function useStudentSearch(query, minChars = 3) {
  /** @type {[Array, Function]} Search results returned by the API */
  const [results, setResults] = useState([]);

  /** @type {[boolean, Function]} Whether a fetch request is currently in flight */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Remove leading/trailing whitespace before checking length
    const trimmed = query.trim();

    // If query is too short, clear results and skip the API call
    if (trimmed.length < minChars) {
      setResults([]);
      return;
    }

    /**
     * Flag to prevent state updates if this effect is cleaned up before
     * the fetch completes (e.g., user typed again while request was in flight).
     */
    let cancelled = false;

    // Indicate loading has started
    setLoading(true);

    // Call the backend search endpoint with the encoded query
    fetch(`/api/students/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data) => {
        // Only update state if this request hasn't been superseded
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        // On network/parse error, clear results (if not cancelled)
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        // Mark loading as complete (if not cancelled)
        if (!cancelled) setLoading(false);
      });

    // Cleanup: mark this request as cancelled so its callbacks become no-ops
    return () => {
      cancelled = true;
    };
  }, [query, minChars]);

  return { results, loading };
}
