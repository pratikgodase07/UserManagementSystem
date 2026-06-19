/**
 * EditModal Component
 * Pre-requisites covered: Components, Props, State, useEffect, Conditional Rendering
 * Shows a modal form to edit a user; triggers confirmation dialog before saving
 */

import { useState, useEffect } from 'react';
import { useUserForm } from '../hooks/useUserForm';
import ConfirmDialog from './ConfirmDialog';

const EditModal = ({ user, onClose, onSave }) => {
  const { formData, errors, handleChange, validate, setForm } = useUserForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // useEffect: populate form when user prop changes (pre-requisite)
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        address: user.address,
        salary: String(user.salary),
      });
    }
  }, [user]); // dependency array: re-run when `user` changes

  const handleUpdate = () => {
    if (!validate()) return;
    setShowConfirm(true); // Show confirmation before saving
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      await onSave(user.id, {
        name: formData.name,
        address: formData.address,
        salary: parseFloat(formData.salary),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // Conditional Rendering
  if (!user) return null;

  return (
    <>
      <div className="overlay">
        <div className="modal">
          <h3 className="modal-title">EDIT USER</h3>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`input-field ${errors.address ? 'input-error' : ''}`}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`input-field ${errors.salary ? 'input-error' : ''}`}
            />
            {errors.salary && <span className="error-text">{errors.salary}</span>}
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Updating...' : 'UPDATE'}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>CANCEL</button>
          </div>
        </div>
      </div>

      {/* Nested conditional: confirm dialog on top of modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to update this user?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default EditModal;
