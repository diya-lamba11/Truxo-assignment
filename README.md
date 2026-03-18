---

```md
# Student Search Application

A single-page application (SPA) with a search bar that implements search and lazy loading for student data. Built with a React.js frontend and an Express.js RESTful backend that serves data from a local JSON file (no database required).

---

## 🚀 Tech Stack

- **Frontend:** React.js 18 (Vite)
- **Backend:** Node.js with Express
- **Data Source:** Local JSON file (`student_data.json`)


---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm

---

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install client + server dependencies
npm run install:all
````

---

## ▶️ Running the Application

### Option 1: Run both frontend & backend

```bash
npm run dev
```

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5001](http://localhost:5001)

---

### Option 2: Run separately

**Terminal 1 (Backend):**

```bash
npm run start:server
```

**Terminal 2 (Frontend):**

```bash
npm run start:client
```

---

## 🔗 API Endpoints

| Method | Endpoint                         | Description                                          |
| ------ | -------------------------------- | ---------------------------------------------------- |
| GET    | `/api/students/search?q=<query>` | Search students by name (min 3 chars, max 5 results) |
| GET    | `/api/students/:rollNumber`      | Get student by roll number                           |

---

### Example

```http
GET /api/students/search?q=jas
```

```json
[
  { "name": "Jaspreet Kaur", "class": 9, "rollNumber": 10002 },
  { "name": "Jaskiran Kaur", "class": 7, "rollNumber": 10026 },
  { "name": "Jaswinder Singh", "class": 12, "rollNumber": 10033 }
]
```

---

## ✨ Features

* Lazy loading (search after 3 characters)
* Debouncing (300ms delay)
* Case-insensitive search
* Highlight matching text
* Keyboard navigation (↑ ↓ Enter Esc)
* Responsive design
* Accessible (ARIA combobox support)

---

## 🧠 Custom Hooks

| Hook               | File                                   | Purpose                                         |
| ------------------ | -------------------------------------- | ----------------------------------------------- |
| `useDebounce`      | `client/src/hooks/useDebounce.js`      | Prevents API calls on every keystroke           |
| `useClickOutside`  | `client/src/hooks/useClickOutside.js`  | Detects outside clicks to close dropdown        |
| `useStudentSearch` | `client/src/hooks/useStudentSearch.js` | Handles API calls, loading, and race conditions |

---

## ⚠️ Edge Cases Handled

* Similar name prefixes (e.g., Amritpal vs Amarjeet)
* Case-insensitive matching
* Duplicate names (handled via roll number)
* Special characters safely handled
* Click outside closes dropdown
* Prevents stale API responses (race condition handling)

---

## 🧩 Design Decisions

* **No Database:** Uses in-memory JSON for simplicity and speed
* **Custom Hooks:** Avoids external libraries → cleaner & lightweight
* **Vite Proxy:** Handles API calls without CORS issues
* **JSDoc Comments:** Improves readability and developer experience

---

## 📌 Notes

* Ensure both frontend and backend are running simultaneously
* Minimum 3 characters required for search
* API returns a maximum of 5 results
