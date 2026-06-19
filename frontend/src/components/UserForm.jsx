/**
 * UserForm Component
 * Pre-requisites covered: Components, Props, State, Event Handling, Loading States
 * Responsible for: input fields + save user
 */

import { useState } from 'react';
import { useUserForm } from '../hooks/useUserForm';
import { useUsers } from '../context/UserContext';

const UserForm = () => {
  const { addUser } = useUsers();
  const { formData, errors, handleChange, validate, resetForm } = useUserForm();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Event Handling
    if (!validate()) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      await addUser({
        name: formData.name,
        address: formData.address,
        salary: parseFloat(formData.salary),
      });
      resetForm();
      setSuccessMsg('User added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // Error is handled in context; could also show local error here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">USER MANAGEMENT</h2>

      {/* Success message — Conditional Rendering (pre-requisite) */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="user-form" noValidate>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'input-error' : ''}`}
          />
          {/* Conditional rendering of error */}
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={`input-field ${errors.address ? 'input-error' : ''}`}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        <div className="form-group">
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className={`input-field ${errors.salary ? 'input-error' : ''}`}
          />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>

        {/* Loading State (pre-requisite) */}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'SAVE USER'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
