import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./StaffTaskAssignList.css";
import StaffTaskAssignModal from "./StaffTaskAssignModal";

function StaffTaskAssignList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
   setRoleFilter("");
   setNameFilter("");
  // ✅ Fetch tasks for logged-in staff
  const fetchTasks = async () => {
    try {
      const loggedStaff = JSON.parse(localStorage.getItem("user"));
      if (!loggedStaff) {
        console.error("No logged-in staff found");
        return;
      }

      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/tasks/tasks");

      // ✅ Filter tasks to only show ones assigned to this staff
      const filteredTasks = res.data.filter(
        (task) => task.assignedTo?._id === loggedStaff.id
      );

      setTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`https://rjtaskmanagment-server.onrender.com/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  
 

  // ✅ Combined Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.taskName?.toLowerCase().includes(searchName.toLowerCase()) ||
      t.company?.name?.toLowerCase().includes(searchName.toLowerCase());

    const matchesDate = searchDate
      ? new Date(t.scheduledTime).toISOString().split("T")[0] === searchDate
      : true;

    const matchesRole = roleFilter
      ? t.role?.toLowerCase() === roleFilter.toLowerCase()
      : true;

    const matchesName = nameFilter
      ? t.assignedTo?.name?.toLowerCase() === nameFilter.toLowerCase()
      : true;

    return matchesSearch && matchesDate && matchesRole && matchesName;
  });

  return (
    <div className="task-list-container">
      <h1>Assigned Tasks</h1>

      <div className="task-list-header">
        <div className="filters" style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="form-control"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="form-control"
          />

          
            

          
          

          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchName("");
              setSearchDate("");
             
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <button
        className="add-task-btn mb-2"
        style={{ float: "right" }}
        onClick={() => setIsModalOpen(true)}
      >
        + Add Task
      </button>

      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Scheduled Time</th>
              <th>Role</th>
              <th>Assigned To</th>
              <th>Company</th>
              <th>Status</th>
              <th>Repeat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.taskName}</td>
                  <td>{t.description || "—"}</td>
                  <td style={{ color: "red" }}>
                    {new Date(t.scheduledTime).toLocaleString()}
                  </td>
                  <td>{t.role}</td>
                  <td>{t.assignedTo ? t.assignedTo.name : "Myself"}</td>
                  <td>{t.company?.name}</td>
                  <td
                    className={
                      t.status === "pending"
                        ? "status-pending"
                        : t.status === "in-progress"
                        ? "status-inprogress"
                        : t.status === "completed"
                        ? "status-completed"
                        : ""
                    }
                  >
                    {t.status}
                  </td>
                  <td>{t.repeat}</td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <StaffTaskAssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchTasks}
      />
    </div>
  );
}

export default StaffTaskAssignList;
