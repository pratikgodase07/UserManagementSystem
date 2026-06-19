/**
 * Custom Hook: useUserForm
 * Pre-requisite: Hooks, useState, Controlled Components
 * Encapsulates all form logic — reusable for both Add and Edit forms
 */

import { useState } from 'react';

const INITIAL_STATE = { name: '', address: '', salary: '' };

export const useUserForm = (initialValues = INITIAL_STATE) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Controlled input handler — Event Handling (pre-requisite)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) <= 0)
      newErrors.salary = 'Valid salary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  const setForm = (values) => {
    setFormData(values);
    setErrors({});
  };

  return { formData, errors, handleChange, validate, resetForm, setForm };
};
