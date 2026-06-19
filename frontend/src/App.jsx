/**
 * App Component — Root of the React app
 * Pre-requisites covered: Component Lifecycle, useEffect, useRef, Context
 * useEffect here = ComponentDidMount (fetch users on load)
 */

import { useEffect, useRef } from 'react';
import { UserProvider, useUsers } from './context/UserContext';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import './App.css';

// Inner component (needs to be inside UserProvider to access useUsers)
const AppContent = () => {
  const { fetchUsers } = useUsers();

  // useRef: track if initial fetch has already run (pre-requisite)
  const hasFetched = useRef(false);

  // useEffect with empty dependency array = ComponentDidMount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUsers();
    }
  }, [fetchUsers]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management System</h1>
        <p>React + .NET Web API + SQLite | Clean Architecture</p>
      </header>

      <main className="app-main">
        <UserForm />
        <UserTable />
      </main>
    </div>
  );
};

// App wraps everything with UserProvider (Context)
const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
