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
  



  
  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/tasks");
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
      await axios.delete(`https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/${id}`);
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
  const filteredTasks = tasks.filter((t) => {
  const matchesSearch =
    t.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesDate = filterDate
    ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate
    : true;

  return matchesSearch && matchesDate; // ✅ Ensure BOTH search & date match
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

      <div className="task-list-header">
           
        
        <div className="task-filters">
          <input
            type="text"
            placeholder="Search....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          </div>
        {/* <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
          + Add Task
        </button> */}
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

