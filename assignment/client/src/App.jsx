/**
 * @fileoverview Root application component.
 * Manages the selected student state and composes the SearchBar and StudentCard components.
 */

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import StudentCard from "./components/StudentCard";

/**
 * App — top-level component that renders the page layout.
 *
 * State:
 * - `selectedStudent` — the student object chosen from the search dropdown, or null if none selected.
 *
 * @returns {JSX.Element} The full application UI
 */
function App() {
  /** @type {[object|null, Function]} Holds the currently selected student */
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="app">
      <h1 className="app-title">Student Search</h1>
      <p className="app-subtitle">
        Search for students by name (type at least 3 characters)
      </p>

      {/* SearchBar calls setSelectedStudent when the user picks a result */}
      <SearchBar onSelectStudent={setSelectedStudent} />

      {/* Only render the StudentCard once a student has been selected */}
      {selectedStudent && <StudentCard student={selectedStudent} />}
    </div>
  );
}

export default App;
