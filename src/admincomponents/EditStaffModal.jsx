import React, { useState, useEffect } from "react";
import axios from "axios";
import"./EditStaffModal.css"

export default function EditStaffModal({ isOpen, onClose, staffData, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    assistantManager: "",
    contactNumber: "",
    email: "",
    role: "",
  });

  const [assistantManagers, setAssistantManagers] = useState([]);

  useEffect(() => {
    if (staffData) setForm(staffData);
  }, [staffData]);

  useEffect(() => {
    const fetchAssistantManagers = async () => {
      try {
        const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/assistant-managers");
        setAssistantManagers(res.data);
      } catch (err) {
        console.error("Error fetching assistant managers:", err);
      }
    };
    fetchAssistantManagers();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://rj-task-managment-rjatlas-server.vercel.app/api/auth/${staffData._id}/update`, form);
      alert("Staff updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating staff:", err);
      alert("Failed to update staff");
    }
  };
console.log(form,"fooooooooooooooorm");

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Staff</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />

          <select
            name="assistantManager"
            // value={form.assistantManager || ""}
            value={form.assistantManager?._id || ""}
            onChange={handleChange}
          >
            <option value="">Select Assistant Manager</option>
            {assistantManagers.map((am) => (
              <option key={am._id} value={am._id}>
                {am.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="staff">Staff</option>
            <option value="assistant-manager">Assistant Manager</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
