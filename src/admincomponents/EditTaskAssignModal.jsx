// EditTaskAssignModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskAssignFormModal.css"; // reuse same styles

function EditTaskAssignModal({ isOpen, onClose, onUpdated, taskData: task }) {
  const [form, setForm] = useState({
    taskName: "",
    description: "",
    scheduledTime: "",
    role: "",
    assignedTo: "",
    status: "pending",
    repeat: "once",
    company: { id: "", name: "" },
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Load existing task data into form
  useEffect(() => {
    if (task) {
      setForm({
        taskName: task.taskName || "",
        description: task.description || "",
        scheduledTime: task.scheduledTime
          ? new Date(task.scheduledTime).toISOString().slice(0, 16)
          : "",
        role: task.role || "",
        assignedTo: task.assignedTo?._id || "",
        status: task.status || "pending",
        repeat: task.repeat || "once",
        company: task.company || { id: "", name: "" },
      });
    }
  }, [task]);

  // ✅ Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    if (isOpen) fetchCompanies();
  }, [isOpen]);

  // ✅ Fetch users by role
  useEffect(() => {
    if (!form.role) return;

    let endpoint = "";
    if (form.role === "manager") endpoint = "/api/managers";
    else if (form.role === "assistantmanager") endpoint = "/api/assistant-managers";
    else if (form.role === "staff") endpoint = "/api/auth";

    if (endpoint) {
      axios
        .get(`https://rj-task-managment-rjatlas-server.vercel.app${endpoint}`)
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [form.role]);

  // ✅ Handle input change
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

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/${task._id}`,
        form
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error updating task:", err);
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-title">Edit Task</h2>
          <form onSubmit={handleSubmit} className="modal-form">
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
            <select
              name="company"
              value={form.company.id}
              onChange={handleChange}
              required
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="assistantmanager">Assistant Manager</option>
              <option value="staff">Staff</option>
            </select>

            {form.role && (
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

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select name="repeat" value={form.repeat} onChange={handleChange}>
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <div className="modal-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "Update Task"}
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

export default EditTaskAssignModal;
