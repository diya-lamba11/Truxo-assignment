/**
 * @fileoverview Custom hook that debounces a rapidly changing value.
 * Useful for delaying API calls until the user stops typing.
 */

import { useState, useEffect } from "react";

/**
 * useDebounce — returns a debounced version of the input value.
 *
 * The returned value only updates after the caller stops changing `value`
 * for at least `delay` milliseconds. Each new change resets the timer.
 *
 * @param {*} value - The value to debounce (typically a string from an input field)
 * @param {number} [delay=300] - Debounce delay in milliseconds
 * @returns {*} The debounced value (same type as `value`)
 *
 * @example
 * const debouncedSearch = useDebounce(searchText, 300);
 * // debouncedSearch updates 300ms after the user stops typing
 */
export function useDebounce(value, delay = 300) {
  /** Holds the debounced value; initially matches the input */
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: clear the timer if value or delay changes before it fires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
