import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StaffDashboard.css";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function StaffDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState(""); // Task name filter
  const [filterDate, setFilterDate] = useState(""); // Date filte
  // ✅ Get logged-in staff from localStorage
  const staff = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!staff) return;

    // ✅ Fetch tasks assigned to this staff member
    axios
      .get(`https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/user/${staff.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks || res.data);
      })
      .catch((err) => {
        console.error("Error fetching staff tasks:", err);
      })
      .finally(() => setLoading(false));
  }, [staff, token]);

  // ✅ Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Optimistically update UI
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  // if (!staff) {
  //   return <p className="no-login">Please login as staff first.</p>;
  // }

  // ✅ Prepare data for Pie Chart
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status || "pending"]++;
      return acc;
    },
    { pending: 0, "in-progress": 0, completed: 0 }
  );

  const chartData = [
    { name: "Pending", value: statusCounts.pending },
    { name: "In Progress", value: statusCounts["in-progress"] },
    { name: "Completed", value: statusCounts.completed },
  ];

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"]; // Yellow, Blue, Green

  if (!staff) return <p className="no-login">Please login as staff first.</p>;

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

 <div className="staff-dashboard">
      <h2 className="dashboard-title">Welcome, {staff.name}</h2>

      {loading ? (
        <p className="loading-text">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="no-task-text">No tasks assigned to you.</p>
      ) : (
        <>
          {/* ===== Pie Chart ===== */}
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius="80%"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ===== Responsive Table ===== */}
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
                {Array.isArray(filteredTasks) && filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                    <td>{task.assignedBy || "N/A"}</td>
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
                        {/* <option value="cancelled">Cancelled</option> */}
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
