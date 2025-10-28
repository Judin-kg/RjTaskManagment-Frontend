import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDepartmentModalForm from "./AddDepartmentModalForm";
import "./DepartmentListTable.css";
import EditDepartmentModalForm from "./EditDepartmentModalForm";

export default function DepartmentListTable() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search term state
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("https://rj-task-managment-rjatlas-server.vercel.app/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

   // ✅ Filter departments by name (case-insensitive)
  const filteredDepartments = departments.filter((dept) =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // <div className="department-list-container">
    //   <div className="department-list-header">
    //     <h1>Departments</h1>
    //     <button className="add-department-btn" onClick={() => setShowModal(true)}>
    //       + Add Department
    //     </button>
    //   </div>

    //   <table className="department-table">
    //     <thead>
    //       <tr>
    //         <th>Name</th>
    //         <th>Description</th>
    //         <th>Created At</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {departments.length > 0 ? (
    //         departments.map((dept) => (
    //           <tr key={dept._id}>
    //             <td>{dept.name}</td>
    //             <td>{dept.description || "-"}</td>
    //             <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
    //             <td>
    //               <button
    //                 className="delete-btn"
    //                 onClick={async () => {
    //                   await axios.delete(`http://localhost:3000/api/departments/${dept._id}`);
    //                   fetchDepartments();
    //                 }}
    //               >
    //                 Delete
    //               </button>
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="4" style={{ textAlign: "center" }}>
    //             No departments found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>

    //   <AddDepartmentModalForm
    //     isOpen={showModal}
    //     onClose={() => setShowModal(false)}
    //     onCreated={fetchDepartments}
    //   />
    // </div>
     
     <div className="department-list-container">
       <h1>Departments</h1>

         {/* ✅ Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control w-75 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <div className="department-list-header">
        

        
        <button
          className="add-department-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Department
        </button>
      </div>

      <div className="table-wrapper">
        <table className="department-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.name}</td>
                  <td>{dept.description || "-"}</td>
                  <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                   <td>
                <button
                    className="delete-btn"
                    onClick={async () => {
                      await axios.delete(`https://task-managment-server-neon.vercel.app/api/departments/${dept._id}`);
                      fetchDepartments();
                    }}
                  >
                    Delete
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No departments found
                </td>
              </tr>
            )}
          </tbody> */}
           <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.name}</td>
                  <td>{dept.description || "-"}</td>
                  <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                        className="edit-btn"
                        onClick={() => {
                          setSelectedDept(dept);
                          setEditModal(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        await axios.delete(
                          `https://rj-task-managment-rjatlas-server.vercel.app/api/departments/${dept._id}`
                        );
                        fetchDepartments();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddDepartmentModalForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchDepartments}
      />
        {/* Edit Modal */}
      {selectedDept && (
        <EditDepartmentModalForm
          isOpen={editModal}
          department={selectedDept}
          onClose={() => {
            setEditModal(false);
            setSelectedDept(null);
          }}
          onUpdated={fetchDepartments}
        />
      )}
    </div>
  );
}
