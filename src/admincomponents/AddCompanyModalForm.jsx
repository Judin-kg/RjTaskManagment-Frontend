import React, { useState } from "react";
import axios from "axios";
import "./AddCompanyModalForm.css";

function AddCompanyModalForm({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rj-task-managment-rjatlas-server.vercel.app/api/companies", form);
      setForm({ name: "" });
      if (onCreated) onCreated(); // refresh company list
      onClose();
    } catch (err) {
      console.error("Error creating company:", err);
      alert("Failed to create company");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Company</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            required
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

export default AddCompanyModalForm;
