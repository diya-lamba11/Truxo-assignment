/**
 * @fileoverview StudentCard component.
 * Displays the full details of a selected student including an avatar
 * generated from their initials, their name, class, and roll number.
 */

/**
 * StudentCard — renders a card showing a student's full information.
 *
 * @param {Object} props
 * @param {Object} props.student - The student object to display
 * @param {string} props.student.name - Full name of the student
 * @param {number} props.student.class - Class/grade the student belongs to
 * @param {number} props.student.rollNumber - Unique roll number identifier
 * @returns {JSX.Element} A styled card with avatar and student details
 */
function StudentCard({ student }) {
  return (
    <div className="student-card">
      {/* Avatar circle showing the student's initials (e.g., "Amritpal Singh" → "AS") */}
      <div className="student-avatar">
        {student.name
          .split(" ")       // Split name into words: ["Amritpal", "Singh"]
          .map((n) => n[0]) // Take first letter of each: ["A", "S"]
          .join("")          // Join into a string: "AS"
          .toUpperCase()}
      </div>

      {/* Student information section */}
      <div className="student-details">
        <h2 className="student-name">{student.name}</h2>

        {/* Class and Roll Number displayed as labeled fields */}
        <div className="student-info">
          <div className="info-item">
            <span className="info-label">Class</span>
            <span className="info-value">{student.class}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Roll Number</span>
            <span className="info-value">{student.rollNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
