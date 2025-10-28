import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export default function CompanyTaskReport() {
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState([]);
const [companySearch, setCompanySearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/tasks");
      setTasks(res.data);
      generateReport(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
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

  const generateReport = (tasks) => {
    const reportMap = {};

    tasks.forEach((task) => {
      const company = task.company?.name || "Unknown Company";
      const assignedTo = task.assignedTo?.name || "Unassigned";
      const role = task.role || "N/A";

      const key = `${company}-${assignedTo}-${role}`;

      if (!reportMap[key]) {
        reportMap[key] = {
          company,
          assignedTo,
          role,
          taskNames: [],
          completed: 0,
          inprogress: 0,
          pending: 0,
        };
      }

      // add task name
      reportMap[key].taskNames.push(task.taskName);

      // count status
      if (task.status === "completed") reportMap[key].completed += 1;
      else if (task.status === "in-progress") reportMap[key].inprogress += 1;
      else if (task.status === "pending") reportMap[key].pending += 1;
    });

    setReport(Object.values(reportMap));
  };

  // ✅ Apply search filters
  const filteredReport = report.filter((row) => {
    const matchesCompany = row.company
      .toLowerCase()
      .includes(companySearch.toLowerCase());
    const matchesAssigned = row.assignedTo
      .toLowerCase()
      .includes(assignedSearch.toLowerCase());

    return matchesCompany && matchesAssigned;
  });
  return (
    <div className="p-6">

        {/* ✅ Pie Chart Section */}
              <div className="task-status-chart pb-5" style={{ marginTop: "2rem" }}>
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
      <h1 className="text-2xl font-bold text-center mb-6 pb-4">🏢 Company Task</h1>
        {/* 🔍 Search Filters */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by Company"
          className="form-control w-auto"
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Assigned To"
          className="form-control w-auto"
          value={assignedSearch}
          onChange={(e) => setAssignedSearch(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setCompanySearch("");
            setAssignedSearch("");
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
              <th>Company</th>
              <th>Assigned To</th>
              <th>Role</th>
              <th>Task Names</th>
              <th>Completed</th>
              <th>In Progress</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.length > 0 ? (
              filteredReport.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.company}</td>
                  <td>{row.assignedTo}</td>
                  <td className="text-capitalize">{row.role}</td>
                  <td>
                    <ul className="mb-0">
                      {row.taskNames.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-success fw-bold">{row.completed}</td>
                  <td className="text-info fw-bold">{row.inprogress}</td>
                  <td className="text-warning fw-bold">{row.pending}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
