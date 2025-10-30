import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./ManagerTaskAssignList.css";
// import TaskAssignFormModal from "./TaskAssignFormModal";
// import ManagerTaskAssignModal from "./ManagerTaskAssignModal";
import AsstManagerTaskAssignModal from "./AsstManagerTaskAssignList";
import EditAsstManagerTaskAssignModal from "./EditAsstManagerTaskAssignModal";

function AsstManagerTaskAssignList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchName, setSearchName] = useState(""); // Task Name filter
  const [searchDate, setSearchDate] = useState(""); // Scheduled Date filter
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [availableNames, setAvailableNames] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);


  // Fetch tasks
  
//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/tasks");
//       setTasks(res.data);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//     }
//   };
const fetchTasks = async () => {
  try {
    const loggedManager = JSON.parse(localStorage.getItem("assistantManager")); // ✅ Get logged-in manager
       console.log("Logged-in userrrrrrrrrrrrrrr:", loggedManager);
    console.log("localStoragegegegegegege",localStorage);

    if (!loggedManager) {
      console.error("No logged-in manager found");
      return;
    }

    const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/tasks/tasks");

    // ✅ Filter tasks to only show ones assigned by this manager
    const filteredTasks = res.data.filter(
      (task) => task.assignedBy === loggedManager.id
    );

    setTasks(filteredTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
};


  console.log("Taskssssssssssssssss:", tasks);
  
  useEffect(() => {
    fetchTasks();
  }, []);


  useEffect(() => {
    // Update available names based on selected role
    if (roleFilter) {
      const names = tasks
        .filter((t) => t.role?.toLowerCase() === roleFilter.toLowerCase())
        .map((t) => (t.assignedTo ? t.assignedTo.name : "Myself"));
      setAvailableNames([...new Set(names)]); // unique names
      setNameFilter(""); // reset selected name when role changes
    } else {
      setAvailableNames([]);
      setNameFilter("");
    }
  }, [roleFilter, tasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`https://rjtaskmanagment-server.onrender.com/api/tasks/${id}`);
      fetchTasks(); // refresh after delete
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

   // ✅ Filter tasks based on searchName & searchDate
  // const filteredTasks = tasks.filter((task) => {
  //   const matchesName = task.taskName
  //     ?.toLowerCase()
  //     .includes(searchName.toLowerCase());

  //     const matchescompany = task.company?.name
  //     ?.toLowerCase()
  //     .includes(searchName.toLowerCase());
  //   const matchesDate = searchDate
  //     ? new Date(task.scheduledTime).toISOString().split("T")[0] === searchDate
  //     : true;

  //   return matchesName||matchescompany && matchesDate;
  // });

   const filteredTasks = tasks.filter((t) => {
    const matchesName =
      searchName
        ? t.taskName?.toLowerCase().includes(searchName.toLowerCase()) ||
          t.company?.name?.toLowerCase().includes(searchName.toLowerCase())
        : true;

    const matchesDate = searchDate
      ? new Date(t.scheduledTime).toISOString().split("T")[0] === searchDate
      : true;

    const matchesRole = roleFilter
      ? t.role?.toLowerCase() === roleFilter.toLowerCase()
      : true;

    const matchesSubName = nameFilter
      ? (t.assignedTo ? t.assignedTo.name : "Myself") === nameFilter
      : true;

    return matchesName && matchesDate && matchesRole && matchesSubName;
  });



  return (
    // <div className="task-list-container">
    //   <div className="task-list-header">
    //     <h1>Task List</h1>
    //     <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
    //       + Add Task
    //     </button>
    //   </div>

    //   <table className="task-table">
    //     <thead>
    //       <tr>
    //         <th>Task Name</th>
    //         <th>Description</th>
    //         <th>Scheduled Time</th>
    //         <th>Role</th>
    //         <th>Assigned To</th>
    //         <th>Status</th>
    //         <th>repeat</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {tasks.length > 0 ? (
    //         tasks.map((t) => (
    //           <tr key={t._id}>
    //             <td>{t.taskName}</td>
    //             <td>{t.description || "—"}</td>
    //             <td>{new Date(t.scheduledTime).toLocaleString()}</td>
    //             <td>{t.role}</td>
    //             <td>{t.assignedTo ? t.assignedTo.name : "Myself"}</td>
    //             <td>{t.status}</td>
    //             <td>{t.repeat}</td>
    //             <td>
    //               <button className="edit-btn">Edit</button>
    //               <button
    //                 className="delete-btn"
    //                 onClick={() => handleDelete(t._id)}
    //               >
    //                 Delete
    //               </button>
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="6" style={{ textAlign: "center" }}>
    //             No tasks found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>

    //   {/* Task Assign Modal */}
    //   <AsstManagerTaskAssignModal
    //     isOpen={isModalOpen}
    //     onClose={() => setIsModalOpen(false)}
    //     onCreated={fetchTasks}
    //   />
    // </div>
    <div className="task-list-container">
      <h1>Task List</h1>
  <div className="task-list-header">
    

     {/* ✅ Filter Section */}
      <div className="filters" style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search a Task"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            flex: 1,
          }}
          className="form-control w-50"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          className="form-control w-50"
        />


 {/* Role Filter */}
        <select
          className="form-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ flex: "1 1 150px" }}
        >
          <option value="">All Roles</option>
          <option value="myself">Myself</option>
          <option value="staff">Staff</option>
        </select>

        {/* Dynamic Subcategory / Assigned To Filter */}
        {availableNames.length > 0 && (
          <select
            className="form-select"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ flex: "1 1 150px" }}
          >
            <option value="">All Names</option>
            {availableNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters */}
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setSearchName("");
            setSearchDate("");
            setRoleFilter("");
            setNameFilter("");
          }}
        >
          Clear Filters
        </button>

      </div>
   
  </div>

   <button className="add-task-btn mb-2" style={{float:"right"}}  onClick={() => setIsModalOpen(true)}>
      + Add Task
    </button>

  {/* Table Wrapper for horizontal scroll */}
  <div className="table-wrapper">
    <table className="task-table">
      <thead>
        <tr>
          <th>Task Name</th>
          <th>Description</th>
          <th>Scheduled Time</th>
          <th>Role</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>Company</th>
          <th>Repeat</th>
          <th>Actions</th>
        </tr>
      </thead>
      {/* <tbody>
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.taskName}</td>
              <td>{t.description || "—"}</td>
              <td>{new Date(t.scheduledTime).toLocaleString()}</td>
              <td>{t.role}</td>
              <td>{t.assignedTo ? t.assignedTo.name : "Myself"}</td>
              <td>{t.status}</td>
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
            <td colSpan="8" style={{ textAlign: "center" }}>
              No tasks found
            </td>
          </tr>
        )}
      </tbody> */}
       <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.taskName}</td>
                  <td>{t.description || "—"}</td>
                  <td style={{color:"red"}}>{new Date(t.scheduledTime).toLocaleString()}</td>
                  <td>{t.role}</td>
                  <td>{t.assignedTo ? t.assignedTo.name : "Myself"}</td>
                  {/* <td>{t.status}</td> */}
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
                  <td>{t.company?.name}</td>
                  <td>{t.repeat}</td>
                  <td>
                    <button
  className="edit-btn w-75 mb-1"
  onClick={() => {
    setSelectedTask(t);
    setIsEditModalOpen(true);
  }}
>
  Edit
</button>

                    <button
                      className="delete-btn w-75"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
    </table>
  </div>

  {/* Task Assign Modal */}
  <AsstManagerTaskAssignModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onCreated={fetchTasks}
  />
  {isEditModalOpen && (
  <EditAsstManagerTaskAssignModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    onUpdated={fetchTasks}
    taskData={selectedTask}
  />
)}

</div>

  );
}
export default AsstManagerTaskAssignList;