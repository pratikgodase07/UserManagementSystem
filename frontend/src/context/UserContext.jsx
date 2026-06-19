/**
 * Context API (pre-requisite: useContext, State Management)
 * Provides global user state + operations to all components
 * Avoids prop drilling across the component tree
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';

// 1. Create Context
const UserContext = createContext(null);

// 2. Provider Component — wraps the app, holds shared state
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback: memoizes fetchUsers so it doesn't recreate on every render
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    const newUser = await createUser(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const editUser = useCallback(async (id, userData) => {
    const updated = await updateUser(id, userData);
    setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
    return updated;
  }, []);

  const removeUser = useCallback(async (id) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return (
    <UserContext.Provider value={{ users, loading, error, fetchUsers, addUser, editUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook to consume context (pre-requisite: Custom Hook pattern)
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within UserProvider');
  return context;
};
