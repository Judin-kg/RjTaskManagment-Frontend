import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskListTable.css";
import TaskAssignFormModal from "./TaskAssignFormModal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import EditTaskAssignModal from "./EditTaskAssignModal";
function TaskListTable() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  // Fetch tasks
  
 const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
 const [roleFilter, setRoleFilter] = useState(""); // ✅ NEW state for role filtering
  const [nameFilter, setNameFilter] = useState(""); // ✅ Name Filter (sub-category)
  const [statusFilter, setStatusFilter] = useState("");


  
  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/tasks/tasks");
      setTasks(res.data);

      console.log("Fetched taskssssssss:", res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  console.log("Taskssssssssssssssss:", tasks);
  
  useEffect(() => {
    fetchTasks();
  }, []);


//   const fetchTasks = async () => {
//   try {
//     const res = await axios.get("https://task-manageratlas-backend.vercel.app/api/tasks/tasks");

//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today to midnight

//     const filteredTasks = res.data.filter(task => {
//       const taskDate = new Date(task.scheduledTime);
//       taskDate.setHours(0, 0, 0, 0); // Normalize task date to midnight
//       return taskDate <= today; // Show only past or today's tasks
//     });

//     setTasks(filteredTasks);
//     console.log("Filtered Due/Past Tasks:", filteredTasks);
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//   }
// };

console.log("Tasks State:", tasks);

useEffect(() => {
  fetchTasks();
}, []);


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
 // ✅ Calculate status counts for Pie Chart
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status || "pending"] += 1;
      return acc;
    },
    { pending: 0, "in-progress": 0, completed: 0 }
  );

  const pieData = [
    { name: "Pending", value: statusCounts.pending },
    { name: "In Progress", value: statusCounts["in-progress"] },
    { name: "Completed", value: statusCounts.completed },
  ];

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"]; // yellow, blue, green

   // ✅ Filter logic
  // const filteredTasks = tasks.filter((t) => {
  //   const matchesSearch = t.taskName
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase());

  //     const companyNameMatch = t.company?.name
  //   ?.toLowerCase()
  //   .includes(searchQuery.toLowerCase());

  //   const matchesDate = filterDate
  //     ? new Date(t.scheduledTime).toISOString().split("T")[0] === filterDate
  //     : true;

  //   return matchesSearch ||companyNameMatch && matchesDate;
  // });



//   const filteredTasks = tasks.filter((t) => {
//   const matchesSearch =
//     t.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     t.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());

//   const matchesDate = filterDate
//     ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate
//     : true;

//   return matchesSearch && matchesDate; // ✅ Ensure BOTH search & date match
// });

const availableNames =
    roleFilter && tasks.length > 0
      ? Array.from(
          new Set(
            tasks
              .filter((t) => t.role?.toLowerCase() === roleFilter.toLowerCase())
              .map((t) => t.assignedTo?.name || "N/A")
          )
        )
      : [];

const filteredTasks = tasks.filter((t) => {
     const taskDate = new Date(t.createdAt).toISOString().split("T")[0];
    const matchesSearch = searchQuery
      ? t.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // const matchesDate = filterDate
    //   ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate
    //   : true;

     // ✅ Single date filter removed because we are using range
  const matchesStartDate = startDate ? taskDate >= startDate : true;
  const matchesEndDate = endDate ? taskDate <= endDate : true;

    const matchesRole = roleFilter
      ? t.role?.toLowerCase() === roleFilter.toLowerCase()
      : true;

    const matchesName = nameFilter
      ? t.assignedTo?.name === nameFilter
      : true;

      const matchesStatus = statusFilter
    ? t.status?.toLowerCase() === statusFilter.toLowerCase()
    : true;

    return matchesSearch && matchesStartDate && matchesEndDate && matchesRole && matchesName && matchesStatus;
  });


// ✅ Edit task
  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  return (
    // <div className="task-list-container">
    //       {/* ✅ Pie Chart Section */}
    //   <div className="task-status-chart" style={{ marginTop: "2rem" }}>
    //     <h3>Task Status Overview</h3>
    //     <ResponsiveContainer width="100%" height={300}>
    //       <PieChart>
    //         <Pie
    //           data={pieData}
    //           cx="50%"
    //           cy="50%"
    //           labelLine={false}
    //           outerRadius={120}
    //           dataKey="value"
    //           label={({ name, value }) => `${name}: ${value}`}
    //         >
    //           {pieData.map((entry, index) => (
    //             <Cell key={`cell-${index}`} fill={COLORS[index]} />
    //           ))}
    //         </Pie>
    //         <Tooltip />
    //         <Legend />
    //       </PieChart>
    //     </ResponsiveContainer>
    //   </div>
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
    //         <th>status</th>
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
    //   <TaskAssignFormModal
    //     isOpen={isModalOpen}
    //     onClose={() => setIsModalOpen(false)}
    //     onCreated={fetchTasks}
    //   />
    // </div>
    <div className="task-list-container">
      {/* ✅ Pie Chart Section */}
      <div className="task-status-chart" style={{ marginTop: "2rem" }}>
        <h3>Task Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h1 className="dashboard-title mt-5">Task List</h1>

    
           
        <div className="task-filters container">

  {/* Search */}
  <div className="row g-3 mb-3 w-50">
    <div className="col-12 col-md-6 col-lg-4 w-75">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control"
      />
    </div>
  </div>

  {/* Date Filters */}
  <div className="row g-3 mb-3 w-50">

    <div className="col-12 col-md-6 col-lg-3 w-50">
      <label className="form-label">From Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="form-control"
      />
    </div>

    <div className="col-12 col-md-6 col-lg-3 w-50">
      <label className="form-label">To Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="form-control"
      />
    </div>
  </div>

  {/* Status Filter */}
  <div className="row g-3 mb-3 w-50">
    <div className="col-12 col-md-6 col-lg-4">
      <select
        className="form-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="inprogress">In Progress</option>
      </select>
    </div>
  </div>

  {/* Role Filter */}
  <div className="row g-3 mb-3 w-50">
    <div className="col-12 col-md-6 col-lg-4">
      <select
        className="form-select"
        value={roleFilter}
        onChange={(e) => {
          setRoleFilter(e.target.value);
          setNameFilter("");
        }}
      >
        <option value="">All Roles</option>
        <option value="manager">Manager</option>
        <option value="assistantmanager">Assistant Manager</option>
        <option value="myself">Myself</option>
        <option value="staff">Staff</option>
      </select>
    </div>

    {/* Name Filter — Only if a role is selected */}
    {roleFilter && (
      <div className="col-12 col-md-6 col-lg-4 ">
        <select
          className="form-select"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        >
          <option value="">All {roleFilter}s</option>
          {availableNames.map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  {/* Clear Filters */}
  <div className="row mt-3">
    <div className="col-12 col-md-4 w-50">
      <button
        className="btn btn-outline-secondary "
        onClick={() => {
          setSearchQuery("");
          setStartDate("");
          setEndDate("");
          setRoleFilter("");
          setNameFilter("");
          setStatusFilter("");
        }}
      >
        Clear Filters
      </button>
    </div>
  </div>

</div>

   
     

       <button className="add-task-btn mb-2" style={{float:"right"}} onClick={() => setIsModalOpen(true)}>
          + Add Task
        </button>
      

      {/* ✅ Table Wrapper for Scroll on Mobile/Tablet */}
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
                  <td>{t.company?.name}</td>
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

                  <td>{t.repeat}</td>
                  <td>
                  <button
                      className="edit-btn w-75 mb-1"
                      onClick={() => handleEdit(t)}
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
      <TaskAssignFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchTasks}
      />
      {isEditModalOpen && (
        <EditTaskAssignModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          taskData={selectedTask}
          onUpdated={fetchTasks}
        />
      )}

    </div>
 
    
  );
}
export default TaskListTable;

