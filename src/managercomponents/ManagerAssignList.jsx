// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import "./ManagerDashboard.css";

// export default function ManagerAssignList() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const manager = JSON.parse(localStorage.getItem("manager"));
//    // ✅ logged-in manager
//   const token = localStorage.getItem("managerToken");

//   useEffect(() => {
//     if (!manager) return;

//     // ✅ Fetch tasks based on manager's ID
//     axios
//       .get(`http://localhost:3000/api/tasks/user/${manager.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ secure API call
//         },
//       })
//       .then((res) => {
//         setTasks(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching manager tasks:", err);
//       })
//       .finally(() => setLoading(false));
//   }, [manager, token]);

//   if (!manager) {
//     return <p className="no-login">Please login as a manager first.</p>;
//   }

//   console.log("Manager tasksssssssss:", tasks);
  
//   return (
//     <div className="manager-dashboard">
//       <h2 className="dashboard-title">Welcome, {manager.email}</h2>

//       {loading ? (
//         <p className="loading-text">Loading tasks...</p>
//       ) : tasks.length === 0 ? (
//         <p className="no-task-text">No tasks assigned to you.</p>
//       ) : (
//         <table className="task-table">
//           <thead>
//             <tr>
//               <th>Task Name</th>
//               <th>Description</th>
//               <th>Scheduled Time</th>
//               <th>Assigned By</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr key={task._id}>
//                 <td>{task.taskName}</td>
//                 <td>{task.description}</td>
//                 <td>{new Date(task.scheduledTime).toLocaleString()}</td>
//                 <td>{task.assignedBy}</td>
//                 <td>{task.status || "Pending"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import"./ManagerTaskAssignList.css"
export default function ManagerAssignList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
   const [searchName, setSearchName] = useState(""); // Task name filter
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const manager = JSON.parse(localStorage.getItem("manager"));
  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    if (!manager) return;

    axios
      .get(`https://rjtaskmanagment-server.onrender.com/api/tasks/user/${manager.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error("Error fetching manager tasks:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `https://rjtaskmanagment-server.onrender.com/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state locally (no need to refetch)
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (!manager) {
    return <p className="no-login">Please login as a manager first.</p>;
  }

  // ✅ Prepare Pie Chart Data
  // const statusCounts = tasks.reduce(
  //   (acc, task) => {
  //     acc[task.status || "pending"] += 1;
  //     return acc;
  //   },
  //   { pending: 0, "in-progress": 0, completed: 0 }
  // );
  const statusCounts = Array.isArray(tasks)
  ? tasks.reduce(
      (acc, task) => {
        acc[task.status || "pending"] += 1;
        return acc;
      },
      { pending: 0, "in-progress": 0, completed: 0 }
    )
  : { pending: 0, "in-progress": 0, completed: 0 };


  const pieData = [
    { name: "Pending", value: statusCounts.pending },
    { name: "In Progress", value: statusCounts["in-progress"] },
    { name: "Completed", value: statusCounts.completed },
  ];

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"]; // yellow, blue, green

 // Filter tasks by taskName and filterDate
  const filteredTasks = tasks.filter((task) => {
    const matchesName = task.taskName.toLowerCase().includes(searchName.toLowerCase());

    let matchesDate = true;
    if (filterDate) {
      const taskDate = new Date(task.scheduledTime).toISOString().split("T")[0];
      matchesDate = taskDate === filterDate;
    }

    return matchesName && matchesDate;
  });
  return (
//     <div className="manager-dashboard">
//       <h2 className="dashboard-title">Welcome, {manager.email}</h2>

//       {loading ? (
//         <p className="loading-text">Loading tasks...</p>
//       ) : tasks.length === 0 ? (
//         <p className="no-task-text">No tasks assigned to you.</p>
//       ) : (
// <>



//          {/* ✅ Task Status Pie Chart */}
//           <div className="task-status-chart" style={{ marginTop: "2rem" }}>
//             <h3>Task Status Overview</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={120}
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: ${value}`}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         <table className="task-table">
//           <thead>
//             <tr>
//               <th>Task Name</th>
//               <th>Description</th>
//               <th>Scheduled Time</th>
//               <th>Assigned By</th>
//               <th>repeat</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(tasks) &&
//                 tasks.map((task) =>
//              (
//               <tr key={task._id}>
//                 <td>{task.taskName}</td>
//                 <td>{task.description}</td>
//                 <td>{new Date(task.scheduledTime).toLocaleString()}</td>
//                 <td>{task.assignedBy|| "Unknown"}</td>
//                 <td>{task.repeat || "once"}</td>
//                 <td>
//                   <select
//                     value={task.status || "pending"}
//                     onChange={(e) => handleStatusChange(task._id, e.target.value)}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         </>
//       )}
//     </div>
 <div className="manager-dashboard">
      <h2 className="dashboard-title">Welcome, {manager.email}</h2>

      {loading ? (
        <p className="loading-text">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="no-task-text">No tasks assigned to you.</p>
      ) : (
        <>
          <div className="task-status-chart">
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

          <div className="table-wrapper">
            {/* Search and Date Filter */}
          <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
            <input
            className="form-control"
              type="text"
              placeholder="Search Task Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ padding: "8px", width: "250px" }}
            />
            <input
              type="date"
              
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ padding: "8px" }}
            />
          </div>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Scheduled Time</th>
                  <th>Assigned By</th>
                  <th>Company</th>
                  <th>Repeat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredTasks) && filteredTasks.map((task)=> (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.description || "-"}</td>
                    <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                    <td>{task.assignedBy || "Unknown"}</td>
                    <td>{task.company?.name || "N/A"}</td>
                    <td>{task.repeat || "once"}</td>
                    <td>
                      <select
                        value={task.status || "pending"}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
     </>
      )}
    </div>
  );
}
