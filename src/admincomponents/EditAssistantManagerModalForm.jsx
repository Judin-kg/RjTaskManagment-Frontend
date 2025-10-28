import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddAssistantManagerModalForm.css";

function EditAssistantManagerModalForm({ isOpen, assistant, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    email: "",
    managerId: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assistant) {
      setForm({
        name: assistant.name || "",
        contactNumber: assistant.contactNumber || "",
        email: assistant.email || "",
        managerId: assistant.managerId?.name || "",
        role: assistant.role || "",
      });
    }
  }, [assistant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/assistant-managers/${assistant._id}`,
        form
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating assistant manager:", err);
      alert("Failed to update assistant manager");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2>Edit Assistant Manager</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
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
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
            />
            <input
              type="text"
              name="managerId"
              placeholder="Manager ID"
              value={form.managerId}
              onChange={handleChange}
            />
            <div className="modal-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Updating..." : "Update"}
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

export default EditAssistantManagerModalForm;
