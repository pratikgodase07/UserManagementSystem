import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5290/api/users";

const emptyForm = { name: "", address: "", salary: "" };

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setUsers(res.data);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Required";
    if (!data.address.trim()) errs.address = "Required";
    if (!data.salary || data.salary <= 0) errs.salary = "Required";
    return errs;
  };

  const handleAdd = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    try {
      await axios.post(API_BASE, { ...form, salary: Number(form.salary) });
      setForm(emptyForm);
      setErrors({});
      fetchUsers();
      showToast("✓ User added successfully!");
    } catch {
      showToast("Failed to add user", "error");
    }
  };

  const handleUpdate = async () => {
    const errs = validate(editUser);
    if (Object.keys(errs).length) return setErrors(errs);
    setConfirm({ type: "update", user: editUser });
  };

  const confirmUpdate = async () => {
    try {
      await axios.put(`${API_BASE}/${editUser.id}`, { ...editUser, salary: Number(editUser.salary) });
      setEditUser(null); setConfirm(null); setErrors({});
      fetchUsers();
      showToast("✓ User updated!");
    } catch { showToast("Failed to update", "error"); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${confirm.user.id}`);
      setConfirm(null); fetchUsers();
      showToast("User deleted", "info");
    } catch { showToast("Failed to delete", "error"); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const avgSalary = users.length ? Math.round(users.reduce((s, u) => s + u.salary, 0) / users.length) : 0;
  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarColor = (name) => {
    const colors = ["#185FA5","#3B6D11","#993556","#854F0B","#0F6E56","#533AB7"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; min-height: 100vh; }
        .app { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }

        .topbar { display: flex; align-items: center; gap: 14px; margin-bottom: 2rem; }
        .topbar-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #185FA5, #0C447C); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; box-shadow: 0 4px 12px rgba(24,95,165,0.3); }
        .topbar h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; }
        .topbar p { font-size: 13px; color: #888; margin-top: 2px; }

        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 1.5rem; }
        .stat-card { background: white; border-radius: 14px; padding: 1.1rem 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid transparent; }
        .stat-card.blue { border-left-color: #185FA5; }
        .stat-card.green { border-left-color: #3B6D11; }
        .stat-card.amber { border-left-color: #BA7517; }
        .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #999; margin-bottom: 6px; }
        .stat-value { font-size: 26px; font-weight: 700; color: #1a1a2e; }
        .stat-sub { font-size: 12px; color: #aaa; margin-top: 3px; }

        .card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.07); margin-bottom: 1.5rem; }
        .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem; }
        .card-header h2 { font-size: 15px; font-weight: 600; color: #1a1a2e; }
        .card-header span { font-size: 12px; color: #aaa; margin-left: auto; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px; align-items: end; }
        .field label { display: block; font-size: 11px; font-weight: 600; color: #666; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
        .field input { width: 100%; padding: 10px 13px; font-size: 14px; border: 1.5px solid #e8e8e8; border-radius: 10px; background: #fafafa; color: #1a1a2e; font-family: 'Segoe UI', sans-serif; transition: all 0.2s; }
        .field input:focus { outline: none; border-color: #185FA5; background: white; box-shadow: 0 0 0 3px rgba(24,95,165,0.1); }
        .field input.err { border-color: #E24B4A; background: #fff5f5; }
        .err-msg { font-size: 11px; color: #E24B4A; margin-top: 3px; display: block; }

        .btn { padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Segoe UI', sans-serif; transition: all 0.2s; }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: linear-gradient(135deg, #185FA5, #0C447C); color: white; box-shadow: 0 4px 12px rgba(24,95,165,0.3); white-space: nowrap; }
        .btn-primary:hover { box-shadow: 0 6px 16px rgba(24,95,165,0.4); transform: translateY(-1px); }
        .btn-edit { background: #EBF4FF; color: #185FA5; }
        .btn-edit:hover { background: #D5E9FF; }
        .btn-delete { background: #FFF0F0; color: #E24B4A; }
        .btn-delete:hover { background: #FFE0E0; }
        .btn-success { background: linear-gradient(135deg, #3B6D11, #27500A); color: white; }
        .btn-secondary { background: #f0f0f0; color: #555; }
        .btn-secondary:hover { background: #e4e4e4; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }

        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 2px solid #f0f0f0; }
        th { text-align: left; font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; padding: 0 12px 10px; }
        td { padding: 12px; }
        tbody tr { border-bottom: 1px solid #f7f7f7; transition: background 0.15s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafbff; }

        .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; flex-shrink: 0; }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-name { font-weight: 600; font-size: 14px; color: #1a1a2e; }
        .user-id { font-size: 11px; color: #ccc; }
        .salary-badge { display: inline-block; background: #f0f7eb; color: #3B6D11; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .addr-chip { display: inline-flex; align-items: center; gap: 4px; background: #f5f5f5; color: #666; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
        .actions { display: flex; gap: 6px; }
        .empty-state { text-align: center; padding: 3rem; color: #bbb; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }

        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
        .modal { background: white; border-radius: 18px; padding: 1.75rem; width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: popIn 0.2s ease; }
        @keyframes popIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .modal-title { font-size: 17px; font-weight: 700; color: #1a1a2e; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; }
        .modal .field { margin-bottom: 0.9rem; }
        .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.5rem; }
        .confirm-icon { font-size: 36px; text-align: center; margin-bottom: 10px; }
        .confirm-text { font-size: 14px; color: #555; text-align: center; line-height: 1.6; margin-bottom: 4px; }
        .confirm-name { font-weight: 700; color: #1a1a2e; }

        .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); padding: 12px 22px; border-radius: 12px; font-size: 13px; font-weight: 600; z-index: 200; animation: slideUp 0.25s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.15); white-space: nowrap; }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,12px); } to { opacity:1; transform:translate(-50%,0); } }
        .toast.success { background: #1a1a2e; color: white; }
        .toast.error { background: #E24B4A; color: white; }
        .toast.info { background: #555; color: white; }

        .loading { text-align: center; padding: 3rem; color: #aaa; font-size: 14px; }
        .dot-pulse { display: inline-flex; gap: 5px; }
        .dot-pulse span { width: 8px; height: 8px; border-radius: 50%; background: #185FA5; animation: pulse 1.2s infinite; }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app">
        <div className="topbar">
          <div className="topbar-icon">👥</div>
          <div>
            <h1>User Management System</h1>
            <p>React + .NET Web API · Full Stack CRUD</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card blue">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-sub">registered users</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Avg Salary</div>
            <div className="stat-value">₹{avgSalary.toLocaleString("en-IN")}</div>
            <div className="stat-sub">per month</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Locations</div>
            <div className="stat-value">{new Set(users.map(u => u.address)).size}</div>
            <div className="stat-sub">unique cities</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span>➕</span>
            <h2>Add New User</h2>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pratik Godase" className={errors.name ? "err" : ""} />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="City / Address" className={errors.address ? "err" : ""} />
              {errors.address && <span className="err-msg">{errors.address}</span>}
            </div>
            <div className="field">
              <label>Salary (₹)</label>
              <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 45000" className={errors.salary ? "err" : ""} />
              {errors.salary && <span className="err-msg">{errors.salary}</span>}
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <button className="btn btn-primary" onClick={handleAdd}>+ Save User</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span>📋</span>
            <h2>All Users</h2>
            <span>{users.length} record{users.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="loading"><div className="dot-pulse"><span/><span/><span/></div><p style={{marginTop:12}}>Loading users...</p></div>
          ) : users.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👤</div><p>No users yet. Add one above!</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>#</th><th>User</th><th>Address</th><th>Salary</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: "#ccc", fontSize: 13, width: 40 }}>{i + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar" style={{ background: avatarColor(u.name) }}>{initials(u.name)}</div>
                        <div>
                          <div className="user-name">{u.name}</div>
                          <div className="user-id">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="addr-chip">📍 {u.address}</span></td>
                    <td><span className="salary-badge">₹{u.salary.toLocaleString("en-IN")}</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-edit" onClick={() => { setEditUser({ ...u }); setErrors({}); }}>✏️ Edit</button>
                        <button className="btn btn-sm btn-delete" onClick={() => setConfirm({ type: "delete", user: u })}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editUser && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title">✏️ Edit User</div>
            {["name", "address", "salary"].map(field => (
              <div className="field" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "salary" ? "number" : "text"}
                  value={editUser[field]}
                  onChange={e => setEditUser({ ...editUser, [field]: e.target.value })}
                  className={errors[field] ? "err" : ""}
                />
                {errors[field] && <span className="err-msg">{errors[field]}</span>}
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handleUpdate}>✓ Update User</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="overlay">
          <div className="modal" style={{ textAlign: "center" }}>
            <div className="confirm-icon">{confirm.type === "delete" ? "🗑️" : "✏️"}</div>
            <div className="modal-title" style={{ justifyContent: "center" }}>
              {confirm.type === "delete" ? "Delete User?" : "Confirm Update?"}
            </div>
            <p className="confirm-text">
              {confirm.type === "delete"
                ? <>Are you sure you want to delete <span className="confirm-name">"{confirm.user.name}"</span>?<br />This action cannot be undone.</>
                : <>Update <span className="confirm-name">"{confirm.user.name}"</span> with the new details?</>}
            </p>
            <div className="modal-actions" style={{ justifyContent: "center", marginTop: "1.25rem" }}>
              <button className="btn btn-secondary" onClick={() => setConfirm(null)}>No, Cancel</button>
              <button className={`btn ${confirm.type === "delete" ? "btn-delete" : "btn-success"}`}
                onClick={confirm.type === "delete" ? confirmDelete : confirmUpdate}>
                Yes, {confirm.type === "delete" ? "Delete" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}