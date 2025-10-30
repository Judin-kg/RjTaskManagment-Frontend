
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Explicitly attach plugin
import * as XLSX from "xlsx";

export default function TaskReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
   const [tasks, setTasks] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");
  // const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

  const [roleFilter, setRoleFilter] = useState(""); // ✅ NEW state for role filtering
  const [nameFilter, setNameFilter] = useState(""); // ✅ Name Filter (sub-category)
  const [statusFilter, setStatusFilter] = useState("");
  const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#8884d8", "#0088FE"];

  useEffect(() => {
    fetchReports();
    fetchTasks();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/tasks/reports");
      setReport(res.data);
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/tasks/tasks");
      setTasks(res.data);
      console.log("Fetched taskssssssss:", res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading reports...</p>;
  if (!report) return <p className="text-center mt-4 text-red-500">Failed to load reports</p>;

  // ✅ Convert objects to arrays for Recharts
  const statusData = Object.entries(report.statusCounts || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  const repeatData = Object.entries(report.repeatCounts || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  const topUserData = report.topUsers.map((user) => ({
    name: user.name,
    value: user.count,
  }));

  
// const filteredTasks = tasks.filter((t) => {
//   const matchesSearch =
//     t.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     t.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());

//   const matchesDate = filterDate
//     ? new Date(t.createdAt).toISOString().split("T")[0] === filterDate
//     : true;

//      const matchesRole = roleFilter
//       ? t.role?.toLowerCase() === roleFilter.toLowerCase()
//       : true;

//   return matchesSearch && matchesDate && matchesRole; // ✅ Ensure BOTH search & date match
// });



 // ✅ Get unique names based on selected role


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

  // ✅ Filter Logic (Search + Date + Role + Name)
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



const exportPDF = () => {
  const doc = new jsPDF();

  doc.text("Task Report", 14, 10);

  const tableData = filteredTasks.map((task, i) => [
    i + 1,
        new Date(task.createdAt).toLocaleString(),
        task.taskName,
        task.company?.name || "N/A",
        task.role,
        task.assignedTo?.name || "N/A",
        task.status,
        task.repeat,
  ]);
      // styles: { fontSize: 8 },
      // theme: "grid",
  autoTable(doc, {
    head: [
      [
        "#",
          "Created At",
          "Task Name",
          "Company",
          "Role",
          "Assigned To",
          "Status",
          "Repeat",
      ],
    ],
    body: tableData,
    startY: 20,
  });

  doc.save("task_report.pdf");
};


  // ✅ Excel Export
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTasks.map((t, index) => ({
        "#": index + 1,
        "Created At": new Date(t.createdAt).toLocaleString(),
        "Task Name": t.taskName,
        "Company": t.company?.name || "N/A",
        "Role": t.role,
        "Assigned To": t.assignedTo?.name || "N/A",
        "Status": t.status,
        "Repeat": t.repeat,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "Task_Report.xlsx");
  };

console.log(roleFilter,"roleFilterrrrrrrrrrrrrrrrr");

// ✅ Calculate completion stats per Assigned User
// ✅ Calculate completion stats only for FILTERED tasks
const userCompletionStats = {};

filteredTasks.forEach((task) => {
  const user = task.assignedTo?.name || "Unknown";
  if (!userCompletionStats[user]) {
    userCompletionStats[user] = { total: 0, completed: 0 };
  }
  userCompletionStats[user].total += 1;
  if (task.status === "completed") {
    userCompletionStats[user].completed += 1;
  }
});

// ✅ Get % based on date-filtered tasks
const getCompletionPercent = (name) => {
  const stats = userCompletionStats[name];
  if (!stats || stats.total === 0) return "0%";
  return ((stats.completed / stats.total) * 100).toFixed(1) + "%";
};


console.log(tasks,"taskssssssssssssssss");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Task Reports</h1>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-900">Total Tasks</h2>
          <p className="text-2xl font-bold">{report.totalTasks}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-yellow-900">Pending</h2>
          <p className="text-2xl font-bold">
            {report.statusCounts?.pending || 0}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-green-900">Completed</h2>
          <p className="text-2xl font-bold">
            {report.statusCounts?.completed || 0}
          </p>
        </div>
      </div> */}

   <div className="container my-4">
  <div className="row g-3">
    {/* Total Tasks */}
    <div className="col-12 col-md-4">
      <div className="card shadow-sm text-center p-3">
        <h2 className="h5 text-primary mb-2">Total Tasks</h2>
        <p className="fs-4 fw-bold">{report.totalTasks}</p>
      </div>
    </div>

    {/* Pending */}
    <div className="col-12 col-md-4">
      <div className="card shadow-sm text-center p-3">
        <h2 className="h5 text-warning mb-2">Pending</h2>
        <p className="fs-4 fw-bold text-warning">{report.statusCounts?.pending || 0}</p>
      </div>
    </div>

    {/* Completed */}
    <div className="col-12 col-md-4">
      <div className="card shadow-sm text-center p-3">
        <h2 className="h5 text-success mb-2">Completed</h2>
        <p className="fs-4 fw-bold text-success">{report.statusCounts?.completed || 0}</p>
      </div>
    </div>
  </div>
</div>



      {/* Pie Chart - Task Status */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Repeat Types */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Tasks by Repeat Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={repeatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Top Users */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Top Users by Task Count</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topUserData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

        {/* 📋 Table View */}

              <div className="bg-white p-4 rounded-xl shadow mt-6">
             
        <h2 className="text-xl font-semibold mb-4">📋Tasks report</h2>

        {/* ✅ Export Buttons */}
          <button className="btn btn-danger ms-auto me-2" onClick={exportPDF}>Export PDF</button>
          <button className="btn btn-success" onClick={exportExcel}>Export Excel</button>

          <div className="task-filters">
            
          <input
            type="text"
            placeholder="Search....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

   {/* <div className="d-flex gap-2" style={{marginLeft:"50px",paddingBottom:"20px"}}>
  <div>
    <label className="form-label">From Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="form-control"
    />
  </div>

  <div>
    <label className="form-label">To Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="form-control"
    />
  </div>
</div> */}

<div className="row g-3" style={{ marginLeft: "50px", paddingBottom: "20px" }}>
  <div className="col-12 col-md-6">
    <label className="form-label">From Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="form-control"
    />
  </div>

  <div className="col-12 col-md-6">
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
<select
  className="form-select w-50"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="">All Status</option>
  <option value="pending">Pending</option>
  <option value="completed">Completed</option>
  <option value="inprogress">In Progress</option>
</select>

          {/* Role Filter
          <select
            className="form-select w-50"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="assistantmanager">Assistant Manager</option>
            <option value="myself">Myself</option>
          </select>

          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchQuery("");
              setFilterDate("");
              setRoleFilter("");
            }}
          >
            Clear Filters
          </button> */}


          {/* Role Filter */}
            <select
            className="form-select w-50"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setNameFilter(""); // reset name filter when role changes
            }}
          >
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="assistantmanager">Assistant Manager</option>
            <option value="myself">Myself</option>
            <option value="staff">Staff</option>
          </select>

          {/* Name Filter (only show if a role is selected) */}
          {roleFilter && (
            <select
              className="form-select w-50"
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
          )}


          {/* Clear Filters */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchQuery("");
                setStartDate("");
    setEndDate("");
              setRoleFilter("");
              setNameFilter("");
              setStatusFilter("")
            }}
          >
            Clear Filters
          </button>
        
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Created At</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Company</th>
                <th>Role</th>
                <th>Assigned To</th>
                <th>Avg Completed %</th>  
                <th>Status</th>
                <th>CompletedDate</th>
                <th>Repeat</th>
                <th>Scheduled Time</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                     <td>{new Date(task.createdAt).toLocaleString()}</td>
                    <td>{task.taskName}</td>
                    <td>{task.description || "—"}</td>
                    <td>{task.company?.name || "N/A"}</td>  
                    <td className="text-capitalize">{task.role}</td>
                    <td>{task.assignedTo?.name || "N/A"}</td>
                     <td>{getCompletionPercent(task.assignedTo?.name || "Unknown")}</td>
                    <td>
                      <span
                        className={`badge ${
                          task.status === "completed"
                            ? "bg-success"
                            : task.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                      <td>
    {task.status === "completed"
      ? new Date(task.updatedAt).toLocaleString()
      : "—"}
  </td>
                    <td>{task.repeat}</td>
                    <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          
        </div>
        </div>

      
    </div>
  );
}

