

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import "./AssistantManagerDashboard.css";

// export default function AssistantManagerDashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Get logged-in assistant manager and token
//   const assistantManager = JSON.parse(localStorage.getItem("assistantManager"));
//   const token = localStorage.getItem("assistantManagerToken");

//   useEffect(() => {
//     if (!assistantManager) return;

//     axios
//       .get(`http://localhost:3000/api/tasks/user/${assistantManager.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ secure API call
//         },
//       })
//       .then((res) => {
//         setTasks(res.data.tasks || res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching assistant manager tasks:", err);
//       })
//       .finally(() => setLoading(false));
//   }, [assistantManager, token]);

//   if (!assistantManager) {
//     return <p className="no-login">Please login as an assistant manager first.</p>;
//   }

//   return (
//     <div className="assistant-dashboard">
//       <h2 className="dashboard-title">
//         Welcome, {assistantManager.name || assistantManager.email}
//       </h2>

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
//                 {/* <td>{task.assignedBy?.name || "N/A"}</td> */}
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



import React, {useState } from "react";
import "../admincomponents/AdminDashboard.css"; // Assuming you have a CSS file for styles

// import axios from "axios";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
// } from "recharts";
import AsstManagerAssignList from "./AsstManagerAssignList";
import AsstManagerTaskAssignList from "./AsstManagerAssignTaskModal";
import AssistantManagerReport from "./AssistantManagerReport";


// Sidebar items
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "task", label: "Task" },
  { key: "report", label: "Report" },
 
];

function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
//  const [userGraph, setUserGraph] = useState([]);
//   const [orderGraph, setOrderGraph] = useState([]);


    // 👇 States for dashboard stats
  // const [stats, setStats] = useState({ userCount: 0, orderCount: 0 });

//   useEffect(() => {

//     axios.get("https://smith-server-qpxw.vercel.app/api/dashboard/user-graph").then(res => setUserGraph(res.data));
//     axios.get("https://smith-server-qpxw.vercel.app/api/dashboard/order-graph").then(res => setOrderGraph(res.data));

//     const fetchStats = async () => {
//       try {
//         const res = await axios.get("https://smith-server-qpxw.vercel.app/api/dashboard/stats");
//         if (res.data.success) {
//           setStats(res.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard stats", error);
//       }
//     };
//     fetchStats();
//   }, []);

    // const formatData = (data) =>
    // data.map((d) => ({
    //   month: new Date(2025, d._id - 1).toLocaleString("default", { month: "short" }),
    //   count: d.count,
    // }));

  const handleSelect = (key) => {
    setActive(key);
    setIsOpen(false);
  };



  return (
    <div className="admin-wrap">
      {/* Top bar */}
      <header className="navbar navbar-light bg-white border-bottom sticky-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-lg-none"
              aria-label="Toggle sidebar"
              aria-controls="sidebar"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <span className="navbar-brand mb-0 h1">Asst Manager</span>
          </div>
          <div className="d-none d-sm-block small text-muted">
            {NAV_ITEMS.find((n) => n.key === active)?.label}
          </div>
        </div>
      </header>

      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        <nav
          id="sidebar"
          className={`sidebar bg-light border-end ${isOpen ? "open" : ""}`}
          aria-label="Sidebar"
        >
          <div className="p-3 d-flex flex-column h-100">
            <div className="fs-5 fw-semibold mb-3 text-secondary">Menu</div>
            <ul className="nav nav-pills flex-column gap-1">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    className={`nav-link w-100 text-start ${
                      active === item.key ? "active" : ""
                    }`}
                    aria-current={active === item.key ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto small text-muted">
              <hr />
              <div>v1.0</div>
            </div>
          </div>
        </nav>

        {/* Clickable backdrop for mobile */}
        {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}

        {/* Main content */}
        <main className="content flex-grow-1">
          <div className="container-fluid py-4">
            <h1 className="h3 mb-3">
              {NAV_ITEMS.find((n) => n.key === active)?.label}
            </h1>

            {/* Sections */}
            {active === "dashboard" && (
              <div className="row g-3">
                {/* <div className="col-md-6 col-xl-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title">Users</div>
                      <div className="display-6">{stats.userCount}</div>
                     
                    </div>
                  </div>
                </div> */}
                {/* <div className="col-md-6 col-xl-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title">Orders</div>
                      <div className="display-6">{stats.orderCount}</div>
                     
                    </div>
                  </div>
                </div> */}
                <div className="col-12 col-xl-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title">Overview</div>
                      <p className="mb-0">
                        Welcome to your dashboard. Pick a section from the left
                        to get started.
                      </p>
                    </div>
                  </div>
                </div>
                 {/* Charts */}
      <div className="row g-3">
        
<AsstManagerAssignList />
       
      </div>
              </div>

              
            )}

  


            {active === "task" && (
           <AsstManagerTaskAssignList />
            )}

          

            {active === "report" && (
             <AssistantManagerReport />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Exporting component
export default AdminDashboard;