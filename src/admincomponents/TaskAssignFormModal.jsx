import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskAssignFormModal.css";

function TaskAssignFormModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    taskName: "",
    description: "",
    scheduledTime: "",
    role: "",
    assignedTo: "",
    assignedBy: "", // ✅ new field
    status: "pending", // ✅ new status field
    repeat: "once", // ✅ new repeat field
    // company: "", // ✅ NEW
    company: { id: "", name: "" },
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]); // ✅ NEW
   const [loading, setLoading] = useState(false); // ✅ NEW
    const loggedUser = JSON.parse(localStorage.getItem("user")); // <- Get logged-in user
    console.log("Logged-in userrrrrrrrrrrrrrr:", loggedUser.id);

    useEffect(() => {
    if (loggedUser) {
      // ✅ set assignedBy automatically when modal opens
      setForm((prev) => ({ ...prev, assignedBy: loggedUser.id }));
    }
  }, []);


    // Fetch companies when modal opens
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/companies");
        setCompanies(res.data);

        console.log("Fetched companiessssssss:", companies);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    if (isOpen) fetchCompanies();
  }, [isOpen]);

    
  useEffect(() => {
    if (form.role) {
       if (form.role === "myself" && loggedUser) {
        // Automatically set assignedTo to logged-in user's id
        setForm((prev) => ({ ...prev, assignedTo: loggedUser.id }));
        setUsers([]); // no dropdown
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
      } else {
        setUsers([]);
      }
    }
  }, [form.role]);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // ✅ Handle company selection
    if (name === "company") {
      const selectedCompany = companies.find((c) => c._id === value);
      console.log("Selected companyyyyyyyyyyyyyyy:", selectedCompany);
      
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
        assignedBy: loggedUser?.id || "", // reset with loggedUser id
        status: "pending", // reset status to default
         repeat: "once", // ✅ new repeat field
          // company: "",
         company: { id: "", name: "" },
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error assigning task:", err);
       if (err.response?.status === 409) {
      alert(
        err.response?.data?.error ||
          "Task already exists with the same name, assigned user, and schedule."
      );
    } else {
      alert("Failed to assign task. Please try again later.");
    }
    } finally {
      setLoading(false); // ✅ stop loading
    }
    
  };

  if (!isOpen) return null;
console.log("Form dataaaaaaaaaaaaaaa:", form);

  return (
    // <div className="modal-overlay">
    //   <div className="modal-content">
    //     <h2>Assign Task</h2>
    //     <form onSubmit={handleSubmit} className="modal-form">
    //       <input
    //         type="text"
    //         name="taskName"
    //         placeholder="Task Name"
    //         value={form.taskName}
    //         onChange={handleChange}
    //         required
    //       />

    //       <textarea
    //         name="description"
    //         placeholder="Task Description"
    //         value={form.description}
    //         onChange={handleChange}
    //       />

    //       <input
    //         type="datetime-local"
    //         name="scheduledTime"
    //         value={form.scheduledTime}
    //         onChange={handleChange}
    //         required
    //       />

    //       <select name="role" value={form.role} onChange={handleChange} required>
    //         <option value="">Select Role</option>
    //         <option value="myself">Myself</option>
    //         <option value="manager">Manager</option>
    //         <option value="assistantmanager">Assistant Manager</option>
    //         <option value="staff">Staff</option>
    //       </select>

    //       {/* Conditional dropdown based on role */}
    //       {form.role !== "" && form.role !== "myself" && (
    //         <select
    //           name="assignedTo"
    //           value={form.assignedTo}
    //           onChange={handleChange}
    //           required
    //         >
    //           <option value="">Select {form.role}</option>
    //           {users.map((u) => (
    //             <option key={u._id} value={u._id}>
    //               {u.name}
    //             </option>
    //           ))}
    //         </select>
    //       )}


    //       {/* ✅ Status Dropdown */}
    //       <select
    //         name="status"
    //         value={form.status}
    //         onChange={handleChange}
    //         required
    //       >
    //         <option value="pending">Pending</option>
    //         <option value="in-progress">In Progress</option>
    //         <option value="completed">Completed</option>
    //       </select>

    //        {/* ✅ Repeat Dropdown */}
    //     <select
    //         name="repeat"
    //         value={form.repeat}
    //         onChange={handleChange}
    //         required
    //       >
    //         <option value="once">Once</option>
    //         <option value="weekly">Weekly</option>
    //         <option value="monthly">Monthly</option>
    //       </select>


    //       {/* ✅ Show assignedBy info (read-only) */}
    //       <input
    //         type="text"
    //         name="assignedBy"
    //         value={loggedUser?.username || ""}
    //         readOnly
    //         className="readonly-field"
    //         placeholder="Assigned By"
    //       />

    //       <div className="modal-actions">
    //         <button type="submit" className="save-btn">
    //           Assign Task
    //         </button>
    //         <button type="button" className="cancel-btn" onClick={onClose}>
    //           Cancel
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>

    <div className="modal-overlay" >
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-title">Assign Task</h2>
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

             {/* ✅ Company Dropdown */}
            <select name="company" value={form.company.id} onChange={handleChange} required>
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="myself">Myself</option>
              <option value="manager">Manager</option>
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

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              name="repeat"
              value={form.repeat}
              onChange={handleChange}
              required
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="text"
              name="assignedBy"
              value={loggedUser?.name || ""}
              readOnly
              className="readonly-field"
              placeholder="Assigned By"
            />

            <div className="modal-actions">
              <button type="submit" className="save-btn" disabled={loading}>
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskAssignFormModal;





