import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddAssistantManagerModalForm.css";

function AddAssistantManagerModalForm({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // default password
    contactNumber: "",
    managerId: "",
  });

  const [managers, setManagers] = useState([]);

  // Fetch managers for dropdown
useEffect(() => {
  if (isOpen) {
    axios
      .get("https://rj-task-managment-rjatlas-server.vercel.app/api/managers")
      .then((res) => {
        const managerOnly = res.data.filter((u) => u.role === "manager");
        setManagers(managerOnly);
      })
      .catch((err) => console.error("Error fetching managers:", err));
  }
}, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rj-task-managment-rjatlas-server.vercel.app/api/assistant-managers", {
        ...form,
        role: "assistant_manager",
      });
      setForm({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        managerId: "",
      });
      if (onCreated) onCreated(); // refresh assistant manager list
      onClose();
    } catch (err) {
      console.error("Error creating assistant manager:", err);
      alert("Failed to create Assistant Manager");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Assistant Manager</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

            {/* ✅ Password Field Added */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />

          {/* Manager Dropdown */}
          <select
            name="managerId"
            value={form.managerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Manager</option>
            {managers?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.contactNumber})
              </option>
            ))}
          </select>

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

export default AddAssistantManagerModalForm;
