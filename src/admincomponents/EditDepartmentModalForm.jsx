import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditDepartmentModalForm.css";

export default function EditDepartmentModalForm({ isOpen, onClose, department, onUpdated }) {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (department) {
      setForm({ name: department.name || "", description: department.description || "" });
    }
  }, [department]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/departments/${department._id}`,
        form
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating department:", err);
      alert("Failed to update department");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Department</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
