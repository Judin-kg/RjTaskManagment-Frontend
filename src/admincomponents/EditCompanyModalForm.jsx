import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditCompanyModalForm.css";

export default function EditCompanyModalForm({ isOpen, onClose, company, onUpdated }) {
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    if (company) {
      setForm({ name: company.name || "" });
    }
  }, [company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/companies/${company._id}`,
        form
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating company:", err);
      alert("Failed to update company");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
