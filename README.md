# User Management System
**React 18 + .NET 8 Web API + SQLite | Clean Architecture**

---

## 📁 Project Structure

```
UserManagementSystem/
├── backend/
│   ├── UserManagement.Core/           ← Domain Layer (no dependencies)
│   │   ├── Entities/User.cs           ← Domain entity
│   │   ├── DTOs/UserDto.cs            ← Request/Response DTOs
│   │   └── Interfaces/IUserRepository.cs ← Repository contract
│   │
│   ├── UserManagement.Infrastructure/ ← Data Layer
│   │   ├── Data/AppDbContext.cs       ← EF Core DbContext + seeding
│   │   └── Repositories/UserRepository.cs ← EF Core implementation
│   │
│   └── UserManagement.API/            ← Presentation Layer
│       ├── Controllers/UsersController.cs ← REST endpoints
│       ├── Program.cs                 ← DI registration + middleware
│       └── appsettings.json
│
└── frontend/
    └── src/
        ├── services/userService.js    ← Axios API calls
        ├── context/UserContext.jsx    ← Global state (useContext)
        ├── hooks/useUserForm.js       ← Custom form hook
        ├── components/
        │   ├── UserForm.jsx           ← Add user form
        │   ├── UserTable.jsx          ← Users list table
        │   ├── EditModal.jsx          ← Edit user modal
        │   └── ConfirmDialog.jsx      ← Reusable confirm dialog
        ├── App.jsx                    ← Root component
        └── App.css                    ← All styles
```

---

## 🚀 Setup & Run

### Backend (.NET 8)

**Prerequisites:** .NET 8 SDK installed

```bash
# Navigate to API project
cd backend/UserManagement.API

# Restore packages
dotnet restore

# Add EF Core migration (first time only)
dotnet ef migrations add InitialCreate --project ../UserManagement.Infrastructure

# Run — auto-creates users.db and seeds data
dotnet run
```

API runs at: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

---

### Frontend (React + Vite)

**Prerequisites:** Node.js 18+

```bash
cd frontend

npm install

npm run dev
```

App runs at: `http://localhost:5173`

> Make sure the backend is running before the frontend.

---

## 🔌 API Endpoints

| Method | Endpoint         | Description       |
|--------|------------------|-------------------|
| GET    | /api/users       | Get all users     |
| GET    | /api/users/{id}  | Get user by ID    |
| POST   | /api/users       | Create user       |
| PUT    | /api/users/{id}  | Update user       |
| DELETE | /api/users/{id}  | Delete user       |

**Request body (POST/PUT):**
```json
{
  "name": "Rahul Patil",
  "address": "Pune",
  "salary": 45000
}
```

---

## 🏗️ Architecture Concepts Covered

### Clean Architecture (Both Frontend & Backend)
- **Core** layer has zero external dependencies
- **Infrastructure** depends on Core, never the reverse
- **API** depends on both Core and Infrastructure
- React: `services → hooks → context → components` (one-way data flow)

### Repository Pattern (C#)
- `IUserRepository` interface defined in Core
- `UserRepository` implementation in Infrastructure (EF Core)
- Controller injects `IUserRepository`, not the concrete class
- Swap databases by writing a new repository — zero controller changes

### Entity Framework Core
- `AppDbContext` inherits `DbContext`, declares `DbSet<User>`
- `OnModelCreating()` configures schema and seeds data
- `db.Database.Migrate()` in `Program.cs` auto-creates `users.db`

### MVC Pattern
- **Model:** `User` entity + `UserDto` DTOs
- **View:** React frontend (separate project)
- **Controller:** `UsersController` — receives HTTP, returns JSON

---

## ⚛️ React Concepts Covered

### Hooks Used

| Hook | Where | Purpose |
|------|-------|---------|
| `useState` | All components | Local state |
| `useEffect` | `App.jsx` | Fetch users on mount (ComponentDidMount) |
| `useMemo` | `UserTable.jsx` | Memoize row data computation |
| `useCallback` | `UserContext.jsx` | Memoize async functions |
| `useRef` | `App.jsx` | Prevent double fetch in StrictMode |
| `useContext` | `useUsers()` hook | Consume global user state |

### Component Lifecycle via useEffect
```jsx
// ComponentDidMount equivalent
useEffect(() => {
  fetchUsers();
}, []); // empty deps = run once on mount

// ComponentDidUpdate equivalent
useEffect(() => {
  setForm({ name: user.name, ... });
}, [user]); // runs when `user` prop changes
```

### State Flow
```
UserProvider (global state)
    ↓ users, fetchUsers, addUser, editUser, removeUser
App
    ├── UserForm   → calls addUser
    └── UserTable  → calls editUser, removeUser
            ├── EditModal   → calls onSave
            └── ConfirmDialog
```

### Conditional Rendering
```jsx
{loading && <div>Loading...</div>}
{error && <div className="error">{error}</div>}
{!isOpen && null}   // Don't mount if closed
{users.length === 0 ? <p>No users</p> : <table>...</table>}
```

### Lists & Keys
```jsx
{users.map(user => (
  <tr key={user.id}>   {/* key must be unique, stable, from data */}
    ...
  </tr>
))}
```

---

## 🌐 API Integration (Axios)

```js
// Axios instance — base URL configured once
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Usage in components via context
const { addUser } = useUsers();
await addUser({ name, address, salary });
```

Error handling pattern:
```js
try {
  setLoading(true);
  const data = await getAllUsers();
  setUsers(data);
} catch (err) {
  setError('Failed to load users');
} finally {
  setLoading(false); // always runs
}
```

---

## 📝 Interview Quick-Reference

**Q: What is Clean Architecture?**
Layers where dependencies only point inward. Core has no external packages. Infra depends on Core. API depends on both. You can swap the database without touching the controllers.

**Q: What is the Repository Pattern?**
An interface (in Core) that defines data operations. The concrete class (in Infrastructure) uses EF Core to implement them. The controller only knows about the interface — not EF Core. This makes code testable and database-agnostic.

**Q: Difference between useState and useContext?**
`useState` is local to one component. `useContext` shares state across many components without prop drilling.

**Q: When do you use useEffect?**
When you need to do something *after* render: API calls, subscriptions, DOM manipulation. Empty deps `[]` = once on mount. Deps array = re-run when deps change.

**Q: What is useMemo?**
Caches an expensive computed value so it doesn't recalculate on every render unless its dependencies change.

**Q: What is useCallback?**
Caches a function reference. Useful when passing callbacks to child components — prevents unnecessary re-renders.
