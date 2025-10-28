import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StaffReports.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable"; // ✅ Import the plugin

export default function StaffReports() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

const staff = JSON.parse(localStorage.getItem("user"));
  // const token = localStorage.getItem("managerToken");
  useEffect(() => {
    if (staff?.id) fetchManagerTasks();
  }, [staff]);

  const fetchManagerTasks = async () => {
    try {
      const res = await axios.get(`https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/user/${staff.id}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching manager tasks:", err);
    } finally {
      setLoading(false);
    }
  };
console.log(tasks,"tasssssssssssssssssssssssss");

  if (loading) return <p className="text-center mt-4">Loading tasks...</p>;
 // ✅ Apply filters
  // const filteredTasks = tasks.filter((task) => {
  //   const matchesName = task.taskName
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   const matchesDate = dateFilter
  //     ? new Date(task.createdAt).toISOString().split("T")[0] === dateFilter
  //     : true;

  //   return matchesName && matchesDate;
  // });

  const filteredTasks = Array.isArray(tasks)
  ? tasks.filter((task) => {
      const matchesName = task.taskName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDate = dateFilter
        ? new Date(task.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

      return matchesName && matchesDate;
    })
  : [];



   // ✅ PDF Export
  
  const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("📋 Staff Task Report", 14, 10);

  const tableColumn = [
    "#",
    "Task Name",
    "Description",
    "Role",
    "Assigned To",
    "Assigned By",
    "Repeat",
    "Status",
    "Scheduled Time",
    "Created At",
  ];

  const tableRows = filteredTasks.map((task, index) => [
    index + 1,
    task.taskName,
    task.description || "—",
    task.role,
    task.assignedTo?.name || "N/A",
    task.assignedBy || "N/A",
    task.repeat,
    task.status,
    new Date(task.scheduledTime).toLocaleString(),
    new Date(task.createdAt).toLocaleString(),
  ]);

  // ✅ Use autoTable(doc, {...}) instead of doc.autoTable(...)
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 8 },
  });

  doc.save("staff-task-report.pdf");
};


  // ✅ Excel Export
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTasks.map((task, index) => ({
        "#": index + 1,
        "Task Name": task.taskName,
        Description: task.description || "—",
        Role: task.role,
        "Assigned To": task.assignedTo?.name || "N/A",
        "Assigned By": task.assignedBy || "N/A",
        Repeat: task.repeat,
        Status: task.status,
        "Scheduled Time": new Date(task.scheduledTime).toLocaleString(),
        "Created At": new Date(task.createdAt).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "staff-task-report.xlsx");
  };
  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold text-center mb-6">📋Staff Task Report</h1>

    //   {tasks.length === 0 ? (
    //     <p className="text-center text-gray-500">No tasks found for this manager.</p>
    //   ) : (
    //     <div className="overflow-x-auto">
    //       <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
    //         <thead className="bg-gray-100">
    //           <tr>
    //             <th className="border border-gray-300 px-4 py-2 text-left">#</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Task Name</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Assigned To</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Assigned By</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Repeat</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Scheduled Time</th>
    //             <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {tasks.map((task, index) => (
    //             <tr key={task._id} className="hover:bg-gray-50">
    //               <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
    //               <td className="border border-gray-300 px-4 py-2">{task.taskName}</td>
    //               <td className="border border-gray-300 px-4 py-2">{task.description}</td>
    //               <td className="border border-gray-300 px-4 py-2 capitalize">{task.role}</td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 {task.assignedTo?.name || "N/A"}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 {task.assignedBy || "N/A"}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2">{task.repeat}</td>
    //               <td
    //                 className={`border border-gray-300 px-4 py-2 font-semibold ${
    //                   task.status === "completed"
    //                     ? "text-green-600"
    //                     : task.status === "pending"
    //                     ? "text-yellow-600"
    //                     : task.status === "in-progress"
    //                     ? "text-blue-600"
    //                     : "text-gray-500"
    //                 }`}
    //               >
    //                 {task.status}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 {new Date(task.scheduledTime).toLocaleString()}
    //               </td>
    //               <td className="border border-gray-300 px-4 py-2">
    //                 {new Date(task.createdAt).toLocaleString()}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>
      <div className="staff-reports-container">
      <h1 className="report-title">📋 Staff Task Report</h1>
        {/* 🔎 Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="🔍 Search by task name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-input"
        />

        {(searchTerm || dateFilter) && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            ❌ Clear
          </button>
        )}
      </div>

      {/* 📥 Export Buttons */}
      <div className="export-container">
        <button className="export-btn pdf" onClick={exportPDF}>
          📄 Export PDF
        </button>
        <button className="export-btn excel" onClick={exportExcel}>
          📊 Export Excel
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-tasks-text">No tasks found for this manager.</p>
      ) : (
        <div className="table-responsive">
          <table className="staff-report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Role</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
                <th>Repeat</th>
                <th>Status</th>
                <th>Scheduled Time</th>
                <th>Created At</th>
              </tr>
            </thead>
            {/* <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td>{task.role}</td>
                  <td>{task.assignedTo?.name || "N/A"}</td>
                  <td>{task.assignedBy || "N/A"}</td>
                  <td>{task.repeat}</td>
                  <td className={`status ${task.status}`}>{task.status}</td>
                  <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody> */}

             <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td>{task.role}</td>
                  <td>{task.assignedTo?.name || "N/A"}</td>
                  <td>{task.assignedBy || "N/A"}</td>
                  <td>{task.repeat}</td>
                  <td className={`status ${task.status}`}>{task.status}</td>
                  <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
