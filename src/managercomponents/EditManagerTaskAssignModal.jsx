import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagerTaskAssignModal.css"; // reuse same CSS

function EditManagerTaskAssignModal({ isOpen, onClose, onUpdated, taskData }) {
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


  console.log(taskData,"taskDatatatatataaaaaa");
  
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("manager"));

  // Pre-fill existing task data when modal opens
  useEffect(() => {
    if (taskData) {
      setForm({
        taskName: taskData.taskName || "",
        description: taskData.description || "",
        scheduledTime: taskData.scheduledTime
          ? new Date(taskData.scheduledTime).toISOString().slice(0, 16)
          : "",
        role: taskData.role || "",
        assignedTo: taskData.assignedTo?._id || "",
        assignedBy: taskData.assignedBy || loggedUser?.id || "",
        status: taskData.status || "pending",
        repeat: taskData.repeat || "once",
        company: {
          id: taskData.company?.id || "",
          name: taskData.company?.name || "",
        },
      });
    }
  }, [taskData]);

  // Fetch companies
  useEffect(() => {
    if (!isOpen) return;
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, [isOpen]);

  // Fetch users based on selected role
  useEffect(() => {
    if (form.role) {
      if (form.role === "myself" && loggedUser) {
        setForm((prev) => ({ ...prev, assignedTo: loggedUser.id }));
        setUsers([]);
        return;
      }

      let endpoint = "";
      if (form.role === "manager") endpoint = "/api/managers";
      else if (form.role === "assistantmanager") endpoint = "/api/assistant-managers";
      else if (form.role === "staff") endpoint = "/api/auth";

      if (endpoint) {
        axios
          .get(`https://rjtaskmanagment-server.onrender.com${endpoint}`)
          .then((res) => setUsers(res.data))
          .catch((err) => console.error("Error fetching users:", err));
      }
    }
  }, [form.role]);

  // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "company") {
//       const selectedCompany = companies.find((c) => c._id === value);
//       console.log(selectedCompany,"selectedCompanyyyyy");
      
//       setForm((prev) => ({
//         ...prev,
//         company: { id: selectedCompany._id, name: selectedCompany.name },
//       }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(companies,"companies");
  

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://rjtaskmanagment-server.onrender.com/api/tasks/${taskData._id}`,
        form
      );
      alert("Task updated successfully!");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
console.log(form,"fooooooooorm");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>

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
            <option value="assistantmanager">Assistant Manager</option>
            <option value="staff">Staff</option>
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
          <button
            type="submit"
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Update Task"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditManagerTaskAssignModal;
