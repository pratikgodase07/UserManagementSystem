/**
 * UserTable Component
 * Pre-requisites covered: Lists & Keys, Props, Conditional Rendering, useMemo
 * Displays all users in a table; handles Edit and Delete actions
 */

import { useState, useMemo } from 'react';
import { useUsers } from '../context/UserContext';
import EditModal from './EditModal';
import ConfirmDialog from './ConfirmDialog';

const UserTable = () => {
  const { users, loading, error, editUser, removeUser } = useUsers();
  const [editingUser, setEditingUser] = useState(null);    // user being edited
  const [deletingId, setDeletingId] = useState(null);      // id being deleted
  const [deleteError, setDeleteError] = useState('');

  // useMemo: only recalculate row data when users array changes (pre-requisite)
  const tableRows = useMemo(() =>
    users.map((user, index) => ({ ...user, rowNum: index + 1 })),
    [users]
  );

  const handleEdit = (user) => setEditingUser(user);

  const handleSave = async (id, data) => {
    await editUser(id, data);
    setEditingUser(null);
  };

  const handleDeleteClick = (id) => setDeletingId(id);

  const handleDeleteConfirm = async () => {
    try {
      await removeUser(deletingId);
    } catch {
      setDeleteError('Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Conditional Rendering: Loading / Error / Empty states ────────────────
  if (loading) return <div className="state-msg">Loading users...</div>;
  if (error)   return <div className="state-msg error">{error}</div>;

  return (
    <div className="table-card">
      <h2 className="section-title">USER LIST</h2>

      {deleteError && <div className="alert alert-error">{deleteError}</div>}

      {users.length === 0 ? (
        // Conditional Rendering: empty state
        <p className="state-msg">No users found. Add one above!</p>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Address</th>
                <th>Salary (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Lists & Keys: key prop required for React reconciliation */}
              {tableRows.map(user => (
                <tr key={user.id}>
                  <td>{user.rowNum}</td>
                  <td>{user.name}</td>
                  <td>{user.address}</td>
                  <td>{user.salary.toLocaleString('en-IN')}</td>
                  <td className="action-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal — Conditional Rendering */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        message="Do you want to delete this user?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

export default UserTable;
