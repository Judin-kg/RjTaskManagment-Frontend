import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssistantManagerReportList.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
export default function AssistantManagerReport() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
    // 🔎 Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
const assistantManager = JSON.parse(localStorage.getItem("assistantManager"));
  // const token = localStorage.getItem("managerToken");
  useEffect(() => {
    if (assistantManager?.id) fetchManagerTasks();
  }, [assistantManager]);

  const fetchManagerTasks = async () => {
    try {
      const res = await axios.get(`https://rjtaskmanagment-server.onrender.com/api/tasks/user/${assistantManager.id}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching manager tasks:", err);
    } finally {
      setLoading(false);
    }
  };
console.log(tasks,"tasssssssssssssssssssssssss");

  if (loading) return <p className="text-center mt-4">Loading tasks...</p>;


 // 🔎 Apply filters before rendering
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
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDate = dateFilter
        ? new Date(task.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

      return matchesName && matchesDate;
    })
  : [];


   // 📄 Export to PDF
  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Assistant Manager Task Report", 14, 10);

  //   const tableData = filteredTasks.map((task, i) => [
  //     i + 1,
  //     task.taskName,
  //     task.description || "—",
  //     task.role,
  //     task.assignedTo?.name || "N/A",
  //     task.assignedBy || "N/A",
  //     task.repeat,
  //     task.status,
  //     new Date(task.scheduledTime).toLocaleString(),
  //     new Date(task.createdAt).toLocaleString(),
  //   ]);

  //   doc.autoTable({
  //     head: [
  //       [
  //         "#",
  //         "Task Name",
  //         "Description",
  //         "Role",
  //         "Assigned To",
  //         "Assigned By",
  //         "Repeat",
  //         "Status",
  //         "Scheduled Time",
  //         "Created At",
  //       ],
  //     ],
  //     body: tableData,
  //     startY: 20,
  //   });

  //   doc.save("assistant_manager_report.pdf");
  // };

  const exportPDF = () => {
  const doc = new jsPDF();

  doc.text("Assistant Manager Task Report", 14, 10);

  const tableData = filteredTasks.map((task, i) => [
    i + 1,
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

  autoTable(doc, {
    head: [
      [
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
      ],
    ],
    body: tableData,
    startY: 20,
  });

  doc.save("assistant_manager_report.pdf");
};

  


  // 📊 Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTasks.map((task, i) => ({
        "#": i + 1,
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
    XLSX.writeFile(workbook, "assistant_manager_report.xlsx");
  };

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold text-center mb-6">📋Asst Manager Task Report</h1>

    //   {tasks?.length === 0 ? (
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
    //             {Array.isArray(tasks) &&
    //             tasks.map((task,index) =>
    //            (
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
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        📋 Asst Manager Task Report
      </h1>
       {/* 🔎 Filter Section */}
      <div className="filter-container mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="text"
          placeholder="🔍 Search by task"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50 filter-input"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-control w-50 filter-input"
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
       {/* ✅ Export Buttons */}
      <div className="flex justify-center mb-4">
        <button
          onClick={exportPDF}
          className="btn btn-primary me-3"
        >
          📄 Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="btn btn-success"
        >
          📊 Export Excel
        </button>
      </div>


      {filteredTasks?.length === 0 ? (
        <p className="text-center text-gray-500">
          No tasks found for this manager.
        </p>
      ) : (
        <div className="table-wrapper overflow-x-auto rounded-lg shadow-md">
          <table className="task-table min-w-[700px] md:min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left text-sm md:text-base">#</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Task Name</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Description</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Role</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Assigned To</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Assigned By</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Repeat</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Status</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Scheduled Time</th>
                <th className="border px-3 py-2 text-left text-sm md:text-base">Created At</th>
              </tr>
            </thead>
            {/* <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-sm md:text-base">{index + 1}</td>
                  <td className="border px-2 py-1 text-sm md:text-base">{task.taskName}</td>
                  <td className="border px-2 py-1 text-sm md:text-base">{task.description || "—"}</td>
                  <td className="border px-2 py-1 text-sm md:text-base capitalize">{task.role}</td>
                  <td className="border px-2 py-1 text-sm md:text-base">{task.assignedTo?.name || "N/A"}</td>
                  <td className="border px-2 py-1 text-sm md:text-base">{task.assignedBy || "N/A"}</td>
                  <td className="border px-2 py-1 text-sm md:text-base">{task.repeat}</td>
                  <td
                    className={`border px-2 py-1 text-sm md:text-base font-semibold ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "pending"
                        ? "text-yellow-600"
                        : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="border px-2 py-1 text-sm md:text-base">
                    {new Date(task.scheduledTime).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 text-sm md:text-base">
                    {new Date(task.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody> */}
              <tbody>
              {/* {filteredTasks.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description || "—"}</td>
                  <td className="capitalize">{task.role}</td>
                  <td>{task.assignedTo?.name || "N/A"}</td>
                  <td>{task.assignedBy || "N/A"}</td>
                  <td>{task.repeat}</td>
                  <td
                    className={`font-semibold ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "pending"
                        ? "text-yellow-600"
                        : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                </tr>
              ))} */}
              {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
  filteredTasks.map((task, index) => (
    <tr key={task._id} className="hover:bg-gray-50">
      <td>{index + 1}</td>
      <td>{task.taskName}</td>
      <td>{task.description || "—"}</td>
      <td className="capitalize">{task.role}</td>
      <td>{task.assignedTo?.name || "N/A"}</td>
      <td>{task.assignedBy || "N/A"}</td>
      <td>{task.repeat}</td>
      <td
        className={`font-semibold ${
          task.status === "completed"
            ? "text-green-600"
            : task.status === "pending"
            ? "text-yellow-600"
            : task.status === "in-progress"
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {task.status}
      </td>
      <td>{new Date(task.scheduledTime).toLocaleString()}</td>
      <td>{new Date(task.createdAt).toLocaleString()}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="10" className="text-center">
      No tasks found
    </td>
  </tr>
)}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


