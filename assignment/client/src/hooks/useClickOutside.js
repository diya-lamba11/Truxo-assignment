/**
 * @fileoverview Custom hook that detects clicks outside a referenced DOM element.
 * Commonly used to close dropdowns, modals, or popovers when the user clicks away.
 */

import { useEffect } from "react";

/**
 * useClickOutside — invokes `handler` when a mousedown event occurs outside the element
 * referenced by `ref`.
 *
 * @param {import('react').RefObject} ref - React ref attached to the container element to monitor
 * @param {Function} handler - Callback to execute when a click outside is detected
 *
 * @example
 * const wrapperRef = useRef(null);
 * useClickOutside(wrapperRef, () => setIsOpen(false));
 * // <div ref={wrapperRef}>...</div>
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    /**
     * Event listener that checks if the click target is outside the ref element.
     * @param {MouseEvent} e - The mousedown event
     */
    function listener(e) {
      // Do nothing if the ref is not attached or the click is inside the element
      if (!ref.current || ref.current.contains(e.target)) return;

      // Click was outside — invoke the handler
      handler();
    }

    // Listen for mousedown (fires before click, giving faster feedback)
    document.addEventListener("mousedown", listener);

    // Cleanup: remove the event listener when the hook unmounts or deps change
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
