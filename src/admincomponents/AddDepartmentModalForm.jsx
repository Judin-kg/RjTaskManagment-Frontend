import React, { useState } from "react";
import axios from "axios";
import "./AddDepartmentModalForm.css";

function AddDepartmentModalForm({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rj-task-managment-rjatlas-server.vercel.app/api/departments", form);
      setForm({ name: "", description: "" });
      if (onCreated) onCreated(); // refresh department list
      onClose();
    } catch (err) {
      console.error("Error creating department:", err);
      alert("Failed to create department");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Department</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Department Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
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

export default AddDepartmentModalForm;
