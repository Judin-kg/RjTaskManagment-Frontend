import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddManagerModalForm.css"; // reuse same styles

export default function EditManagerModalForm({ isOpen, onClose, manager, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    email: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://rj-task-managment-rjatlas-server.vercel.app/api/departments")
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error fetching departments:", err));
    }
  }, [isOpen]);

  // ✅ Fill form when editing manager
  useEffect(() => {
    if (manager) {
      setForm({
        name: manager.name || "",
        contactNumber: manager.contactNumber || "",
        email: manager.email || "",
        departmentId: manager.departmentId?._id || "",
      });
    }
  }, [manager]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/managers/${manager._id}`,
        form
      );
      alert("Manager updated successfully!");
      onUpdated(); // refresh list
      onClose();
    } catch (err) {
      console.error("Error updating manager:", err);
      alert("Failed to update manager");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-title">Edit Manager</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              name="name"
              placeholder="Manager Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={form.contactNumber}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Updating..." : "Update Manager"}
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
