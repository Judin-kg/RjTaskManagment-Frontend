import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./StaffTaskAssignModal.css";

function StaffTaskAssignModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    taskName: "",
    description: "",
    scheduledTime: "",
    role: "",
    assignedTo: "",
    assignedBy: "", 
    status: "pending",
    repeat: "once",
    company: { id: "", name: "" },
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ NEW
  const loggedUser = JSON.parse(localStorage.getItem("user")); // ✅ staff login storage
  console.log("Logged-in staff:", loggedUser?.id);
console.log(localStorage,"locallllllllll");

  useEffect(() => {
    if (loggedUser) {
      setForm((prev) => ({ ...prev, assignedBy: loggedUser.id }));
    }
  }, [loggedUser]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    if (isOpen) fetchCompanies();
  }, [isOpen]);

  useEffect(() => {
    if (form.role) {
      if (form.role === "myself" && loggedUser) {
        setForm((prev) => ({ ...prev, assignedTo: loggedUser.id }));
        setUsers([]);
        return;
      }

      let endpoint = "";
      if (form.role === "assistantmanager") endpoint = "/api/assistant-managers";
      else if (form.role === "manager") endpoint = "/api/managers";

      if (endpoint) {
        axios
          .get(`https://rjtaskmanagment-server.onrender.com${endpoint}`)
          .then((res) => setUsers(res.data))
          .catch((err) => console.error("Error fetching users:", err));
      } else {
        setUsers([]);
      }
    }
  }, [form.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company") {
      const selectedCompany = companies.find((c) => c._id === value);
      setForm((prev) => ({
        ...prev,
        company: { id: selectedCompany._id, name: selectedCompany.name },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     setLoading(true); // ✅ start loading
    try {
      await axios.post("https://rjtaskmanagment-server.onrender.com/api/tasks", form);
      setForm({
        taskName: "",
        description: "",
        scheduledTime: "",
        role: "",
        assignedTo: "",
        assignedBy: loggedUser?.id || "",
        status: "pending",
        repeat: "once",
        company: { id: "", name: "" },
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task");
    }finally {
      setLoading(false); // ✅ stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assign Task (Staff)</h2>

        <div className="modal-form">
          <input
            type="text"
            name="taskName"
            placeholder="Task Name"
            value={form.taskName}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="scheduledTime"
            value={form.scheduledTime}
            onChange={handleChange}
            required
          />

          {/* Company Dropdown */}
          <select name="company" value={form.company.id} onChange={handleChange} required>
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="myself">Myself</option>
            {/* <option value="assistantmanager">Assistant Manager</option>
            <option value="manager">Manager</option> */}
          </select>

          {form.role !== "" && form.role !== "myself" && (
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select {form.role}</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select name="repeat" value={form.repeat} onChange={handleChange} required>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="text"
            name="assignedBy"
            value={loggedUser?.role || ""}
            readOnly
            className="readonly-field"
            placeholder="Assigned By"
          />
        </div>

        <div className="modal-actions">
          <button type="submit" className="save-btn" onClick={handleSubmit} disabled={loading} >
           {loading ? (
                  <div className="spinner"></div>
                ) : (
                  "Assign Task"
                )}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffTaskAssignModal;
