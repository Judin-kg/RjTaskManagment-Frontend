import React, {useState } from "react";
import "../admincomponents/AdminDashboard.css"; // Assuming you have a CSS file for styles

// import axios from "axios";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
// } from "recharts";

import ManagerList from "./ManagerList";

// import StaffList from "./StaffListTable.jsx";
import DepartmentList from "./DepartmentListTable.jsx";
import AssistantManagerList from "./AssistantManagerList.jsx";
import CompanyListTable from "./CompanyListTable.jsx";
import StaffListTable from "./StaffListTable.jsx";
import TaskListTable from "./TaskListTable.jsx";
import TaskReports from "./TaskReports.jsx";
import { motion, AnimatePresence } from "framer-motion";
import HierarchyView from "./HierarchyView.jsx";
import CompanyReport from "./CompanyReport.jsx";
import CompanyTaskReport from "./CompanyTaskReport.jsx";
// Sidebar items
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "task", label: "Task" },
  { key: "manager", label: "Manager" },
   { key: "assmanager", label: "Assistent Manager" },
  { key: "staff", label: "Staff" },
   { key: "department", label: "Department" },
   { key: "company", label: "Company" },
   { key: "hierarchy", label: "Hierarchy" },
  { key: "reports", label: "Task Reports" },
  { key: "companyreports", label: "Company Reports" },
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

    <div className="admin-wrap d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <header className="navbar navbar-light bg-white border-bottom sticky-top shadow-sm">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-lg-none"
              aria-label="Toggle sidebar"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <span className="navbar-brand mb-0 h1 fw-bold text-primary">
              Admin Panel
            </span>
          </div>
          <div className="d-none d-sm-block small text-muted">
            {NAV_ITEMS.find((n) => n.key === active)?.label}
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Sidebar with animation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                className="backdrop"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.nav
          id="sidebar"
          className={`sidebar bg-light border-end d-flex flex-column`}
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="p-3 h-100 d-flex flex-column">
            <div className="fs-5 fw-semibold mb-3 text-secondary">Menu</div>
            <ul className="nav nav-pills flex-column gap-2">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.key)}
                    className={`nav-link w-100 text-start ${
                      active === item.key ? "active fw-bold" : ""
                    }`}
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
        </motion.nav>

        {/* Main Content */}
        <main className="content flex-grow-1 p-3 p-md-4 bg-light">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="h4 mb-4 fw-bold text-dark">
                {NAV_ITEMS.find((n) => n.key === active)?.label}
              </h1>

              {active === "dashboard" && (
                <div className="row g-3">
                  <div className="col-md-6 col-xl-4">
                    <motion.div
                      className="card shadow-sm h-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="card-body">
                        <div className="card-title text-primary fw-semibold">
                          Overview
                        </div>
                        <p className="mb-0 text-muted">
                          Welcome to your dashboard. Select a section from the
                          sidebar to get started.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="col-12">
                    {/* <TaskListTable /> */}
                    <CompanyTaskReport />
                  </div>
                </div>
              )}

              {active === "task" && <TaskListTable />}
              {active === "manager" && <ManagerList />}
              {active === "assmanager" && <AssistantManagerList />}
              {active === "staff" && <StaffListTable />}
              {active === "department" && <DepartmentList />}
              {active === "company" && <CompanyListTable />}
              {active === "hierarchy" && <HierarchyView />}
              {active === "reports" && <TaskReports />}
              {active === "companyreports" && <CompanyReport />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
//     <div className="admin-wrap">
//       {/* Top bar */}
//       <header className="navbar navbar-light bg-white border-bottom sticky-top">
//         <div className="container-fluid">
//           <div className="d-flex align-items-center gap-2">
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               aria-label="Toggle sidebar"
//               aria-controls="sidebar"
//               aria-expanded={isOpen}
//               onClick={() => setIsOpen((v) => !v)}
//             >
//               <span className="navbar-toggler-icon" />
//             </button>
//             <span className="navbar-brand mb-0 h1">Admin</span>
//           </div>
//           <div className="d-none d-sm-block small text-muted">
//             {NAV_ITEMS.find((n) => n.key === active)?.label}
//           </div>
//         </div>
//       </header>

//       <div className="d-flex min-vh-100">
//         {/* Sidebar */}
//         <nav
//           id="sidebar"
//           className={`sidebar bg-light border-end ${isOpen ? "open" : ""}`}
//           aria-label="Sidebar"
//         >
//           <div className="p-3 d-flex flex-column h-100">
//             <div className="fs-5 fw-semibold mb-3 text-secondary">Menu</div>
//             <ul className="nav nav-pills flex-column gap-1">
//               {NAV_ITEMS.map((item) => (
//                 <li className="nav-item" key={item.key}>
//                   <button
//                     type="button"
//                     onClick={() => handleSelect(item.key)}
//                     className={`nav-link w-100 text-start ${
//                       active === item.key ? "active" : ""
//                     }`}
//                     aria-current={active === item.key ? "page" : undefined}
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-auto small text-muted">
//               <hr />
//               <div>v1.0</div>
//             </div>
//           </div>
//         </nav>

//         {/* Clickable backdrop for mobile */}
//         {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}

//         {/* Main content */}
//         <main className="content flex-grow-1">
//           <div className="container-fluid py-4">
//             <h1 className="h3 mb-3">
//               {NAV_ITEMS.find((n) => n.key === active)?.label}
//             </h1>

//             {/* Sections */}
//             {active === "dashboard" && (
//               <div className="row g-3">
//                 <div className="col-md-6 col-xl-3">
//                   {/* <div className="card h-100">
//                     <div className="card-body">
//                       <div className="card-title">Users</div>
//                       <div className="display-6">{stats.userCount}</div>
                      
//                     </div>
//                   </div> */}
//                 </div>
//                 {/* <div className="col-md-6 col-xl-3">
//                   <div className="card h-100">
//                     <div className="card-body">
//                       <div className="card-title">Orders</div>
//                       <div className="display-6">{stats.orderCount}</div>
                    
//                     </div>
//                   </div>
//                 </div> */}
//                 <div className="col-12 col-xl-6">
//                   <div className="card h-100">
//                     <div className="card-body">
//                       <div className="card-title">Overview</div>
//                       <p className="mb-0">
//                         Welcome to your dashboard. Pick a section from the left
//                         to get started.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                  {/* Charts */}
//       <div className="row g-3">
        
// <TaskListTable />
       
//       </div>
//               </div>

              
//             )}

  


//             {active === "task" && (
//            <TaskListTable />
//             )}

//             {active === "manager" && (
//              <ManagerList />
//             )}

//              {active === "assmanager" && (
//              <AssistantManagerList />
//             )}

//             {active === "staff" && (
//              <StaffListTable />
//             )}

//              {active === "department" && (
//              <DepartmentList />
//             )}

//             {active === "company" && (
//              <CompanyListTable />
//             )}

//             {active === "reports" && (
//             <TaskReports />
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
  );
}

// ✅ Exporting component
export default AdminDashboard;