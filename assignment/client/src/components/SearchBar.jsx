/**
 * @fileoverview SearchBar component with autocomplete dropdown.
 * Provides a search input that queries the backend API for matching students,
 * displays results in a dropdown with highlighted matching text, and supports
 * keyboard navigation (Arrow keys, Enter, Escape).
 */

import { useState, useRef, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useClickOutside } from "../hooks/useClickOutside";
import { useStudentSearch } from "../hooks/useStudentSearch";

/**
 * Highlights the portions of `text` that match the `query` string.
 * Wraps matched substrings in a <mark> element for visual emphasis.
 *
 * @param {string} text - The full text to search within (e.g., student name)
 * @param {string} query - The search term to highlight
 * @returns {string|JSX.Element[]} Original text if no query, or array of text/mark elements
 */
function highlightMatch(text, query) {
  if (!query) return text;

  // Escape special regex characters in the query to prevent regex errors
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create a case-insensitive regex with a capturing group for the match
  const regex = new RegExp(`(${escaped})`, "gi");

  // Split the text by the regex — matched parts become separate array elements
  const parts = text.split(regex);

  // Map each part: wrap matches in <mark>, leave non-matches as plain text
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * SearchBar — autocomplete search input for finding students by name.
 *
 * @param {Object} props
 * @param {Function} props.onSelectStudent - Callback fired with the selected student object
 * @returns {JSX.Element} The search input with dropdown results
 */
function SearchBar({ onSelectStudent }) {
  /** @type {[string, Function]} The current value in the search input */
  const [query, setQuery] = useState("");

  /** @type {[boolean, Function]} Whether the dropdown is visible */
  const [isOpen, setIsOpen] = useState(false);

  /** @type {[number, Function]} Index of the keyboard-highlighted item (-1 = none) */
  const [activeIndex, setActiveIndex] = useState(-1);

  /** Ref attached to the wrapper div — used by useClickOutside to detect outside clicks */
  const wrapperRef = useRef(null);

  const [history, setHistory] = useState([])

  /** Debounce the raw query by 300ms to avoid firing API requests on every keystroke */
  const debouncedQuery = useDebounce(query, 300);

  /** Fetch search results from the API using the debounced query */
  const { results, loading } = useStudentSearch(debouncedQuery);

  /** Close the dropdown when the user clicks anywhere outside the search wrapper */
  useClickOutside(wrapperRef, useCallback(() => setIsOpen(false), []));

  /** Dropdown should only be visible when it's open AND there are results to show */
  const showDropdown = isOpen && results.length > 0;

  /**
   * Handles input value changes.
   * Updates the query, opens the dropdown, and resets keyboard navigation.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  /**
   * Handles selecting a student from the dropdown.
   * Fills the input with the student's name, closes the dropdown,
   * and notifies the parent component.
   * @param {{name: string, class: number, rollNumber: number}} student - The selected student
   */
  const handleSelect = (student) => {
    setQuery(student.name);
    setIsOpen(false);
    onSelectStudent(student);
  };

  /**
   * Handles keyboard navigation within the dropdown.
   * - ArrowDown / ArrowUp: move the active highlight through the list (wraps around)
   * - Enter: select the currently highlighted student
   * - Escape: close the dropdown
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    // Ignore keyboard navigation if the dropdown isn't visible
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent cursor from moving to end of input
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent cursor from moving to start of input
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault(); // Prevent form submission
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      {/* Input container with search icon and loading spinner */}
      <div className="search-input-container">
        {/* Magnifying glass SVG icon */}
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Search input — uses ARIA combobox pattern for accessibility */}
        <input
          type="text"
          className="search-input"
          placeholder="Search students by name..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          aria-label="Search students"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Spinning loader shown while the API request is in flight */}
        {loading && <span className="search-spinner" />}
      </div>

      {/* Dropdown list of matching students */}
      {showDropdown && (
        <ul className="search-dropdown" role="listbox">
          {results.map((student, index) => (
            <li
              key={student.rollNumber}
              className={`search-dropdown-item ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => handleSelect(student)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              aria-selected={index === activeIndex}
            >
              {/* Student name with matching text highlighted */}
              <span className="dropdown-name">
                {highlightMatch(student.name, query)}
              </span>

              {/* Class and roll number shown as secondary info */}
              <span className="dropdown-meta">
                Class {student.class} &middot; Roll #{student.rollNumber}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
