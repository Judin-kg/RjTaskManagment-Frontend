import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
export default function CompanyReport() {
  const [tasks, setTasks] = useState([]);
  const [companyReport, setCompanyReport] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(""); // ✅ From Date
  const [endDate, setEndDate] = useState(""); // ✅ To Date
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/tasks/tasks");
      setTasks(res.data);
      generateCompanyReport(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    }
  };

  console.log(tasks,"taskssssssssssssss");
  

  // const generateCompanyReport = (tasks) => {
  //   const report = {};

  //   tasks.forEach((task) => {
  //     const companyName = task.company?.name || "Unknown";

  //     if (!report[companyName]) {
  //       report[companyName] = {
  //         total: 0,
  //         pending: 0,
  //         completed: 0,
  //         inprogress: 0,
  //       };
  //     }

  //     report[companyName].total += 1;

  //     const status = task.status?.toLowerCase();
  //     if (status === "pending") report[companyName].pending += 1;
  //     else if (status === "completed") report[companyName].completed += 1;
  //     else if (status === "in-progress") report[companyName].inprogress += 1;
  //   });

  //   setCompanyReport(Object.entries(report));
  // };

  // ✅ Filter report based on search
  
  const generateCompanyReport = (tasks) => {
    const report = {};

    tasks.forEach((task) => {
      // ✅ Filter by date range if startDate or endDate is set
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
      if (startDate && taskDate < startDate) return;
      if (endDate && taskDate > endDate) return;

      const companyName = task.company?.name || "Unknown";

      if (!report[companyName]) {
        report[companyName] = {
          total: 0,
          pending: 0,
          completed: 0,
          inprogress: 0,
        };
      }

      report[companyName].total += 1;

      const status = task.status?.toLowerCase();
      if (status === "pending") report[companyName].pending += 1;
      else if (status === "completed") report[companyName].completed += 1;
      else if (status === "in-progress") report[companyName].inprogress += 1;
    });

    setCompanyReport(Object.entries(report));
  };

  
  const filteredReport = companyReport.filter(([company]) =>
    company.toLowerCase().includes(search.toLowerCase())
  );



 // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("🏢 Company Report", 14, 10);

    const tableData = filteredReport.map(([company, data], index) => [
      index + 1,
      company,
      data.total,
      data.pending,
      data.completed,
      data.inprogress,
    ]);

    autoTable(doc, {
      head: [["#", "Company", "Total", "Pending", "Completed", "In Progress"]],
      body: tableData,
      startY: 20,
    });

    doc.save("company_report.pdf");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReport.map(([company, data], index) => ({
        "#": index + 1,
        Company: company,
        Total: data.total,
        Pending: data.pending,
        Completed: data.completed,
        "In Progress": data.inprogress,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company Report");
    XLSX.writeFile(workbook, "Task_Report.xlsx");

}

//  const exportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredTasks.map((t, index) => ({
//         "#": index + 1,
//         "Created At": new Date(t.createdAt).toLocaleString(),
//         "Task Name": t.taskName,
//         "Company": t.company?.name || "N/A",
//         "Role": t.role,
//         "Assigned To": t.assignedTo?.name || "N/A",
//         "Status": t.status,
//         "Repeat": t.repeat,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
//     XLSX.writeFile(workbook, "Task_Report.xlsx");
//   };


// ✅ Re-generate report whenever tasks or date filters change
  useEffect(() => {
    generateCompanyReport(tasks);
  }, [startDate, endDate, tasks]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🏢 Company Report</h1>
             {/* <div className="mb-4 flex gap-2 justify-end">

                <input
          type="text"
          className="form-control w-50 "
          placeholder="🔍 Search Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-danger  me-2" onClick={exportPDF}>
          📄 Export PDF
        </button>
        <button className="btn btn-success" onClick={exportExcel}>
          📊 Export Excel
        </button>
      </div> */}
      {/* 🔍 Search Box */}
      <div className="mb-4 flex gap-2 justify-between">
        <div className="pb-3">
        <input
          type="text"
          className="form-control w-50 mb-2"
          placeholder="🔍 Search Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="me-2">From:</label>
         <input
            type="date"
            className="form-control mb-2 w-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="me-2">To:</label>
          <input
            type="date"
            className="form-control mb-2 w-50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-danger me-2" onClick={exportPDF}>
            📄 Export PDF
          </button>
          <button className="btn btn-success" onClick={exportExcel}>
            📊 Export Excel
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Total Tasks</th>
              <th>Pending</th>
              <th>Completed</th>
              <th>In Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.length > 0 ? (
              filteredReport.map(([company, data], index) => (
                <tr key={company}>
                  <td>{index + 1}</td>
                  <td>{company}</td>
                  <td>{data.total}</td>
                  <td className="text-warning fw-bold">{data.pending}</td>
                  <td className="text-success fw-bold">{data.completed}</td>
                  <td className="text-info fw-bold">{data.inprogress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



