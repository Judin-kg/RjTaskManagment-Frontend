import React, { useEffect, useState, useContext } from "react";

import "./ManagerList.css";
import AddManagerModalForm from "./AddManagerModalForm"; // import modal
import axios from "axios";
import EditManagerModalForm from "./EditManagerModalForm";

export default function ManagerList() {

  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // state for modal
   const [searchQuery, setSearchQuery] = useState(""); // ✅ new state for filter
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [selectedManager, setSelectedManager] = useState(null);
    //  const [resetId, setResetId] = useState(null);
  const fetchManagers = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/managers");
      const managerOnly = res.data.filter((u) => u.role === "manager");
      setManagers(managerOnly);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

   // ✅ Filter managers safely
  const filteredManagers = managers.filter((m) =>
    (m.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

   // ✅ DELETE manager
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await axios.delete(
        `https://rjtaskmanagment-server.onrender.com/api/managers/${id}`
      );
      setManagers((prev) => prev.filter((m) => m._id !== id)); // update UI immediately
    } catch (err) {
      console.error("Error deleting manager:", err);
      alert("Failed to delete manager");
    }
  };

   const handleResetPassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      await axios.put(`https://rjtaskmanagment-server.onrender.com/api/managers/${id}/reset-password`, {
        newPassword,
      });
      alert("Password reset successfully!");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password");
    }
  };

  // ✅ Edit Manager
  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  return (
    // <div className="manager-list-container">
    //   <div className="manager-list-header">
    //     <h1>Manager List</h1>
    //     <button
    //       className="add-manager-btn"
    //       onClick={() => setIsModalOpen(true)}
    //     >
    //       + Add Manager
    //     </button>
    //   </div>

      

    //   <table className="manager-table">
    //     <thead>
    //       <tr>
    //         <th>Name</th>
    //         <th>Contact Number</th>
    //         <th>Email</th>
    //         <th>Department</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {managers.length > 0 ? (
    //         managers.map((m) => (
    //           <tr key={m._id}>
    //             <td>{m.name}</td>
    //             <td>{m.contactNumber || "-"}</td>
    //             <td>{m.email}</td>
    //              <td>{m.departmentId ? m.departmentId.name : "-"}</td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="3" style={{ textAlign: "center" }}>
    //             No managers found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>

    //   {/* Modal Form */}
    //   <AddManagerModalForm
    //     isOpen={isModalOpen}
    //     onClose={() => setIsModalOpen(false)}
    //     onCreated={fetchManagers}
    //   />
    // </div>
    <div className="manager-list-container">
      {/* Header */}
      <div className="manager-list-header">
        <h1>Manager List</h1>
         {/* ✅ Search Input */}
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="add-manager-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Manager
        </button>
      </div>

      {/* Table Wrapper for Scroll */}
      <div className="table-wrapper">
        <table className="manager-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* <tbody>
            {managers.length > 0 ? (
              managers.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.contactNumber || "-"}</td>
                  <td>{m.email}</td>
                  <td>{m.departmentId ? m.departmentId.name : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No managers found
                </td>
              </tr>
            )}
          </tbody> */}
           <tbody>
            {filteredManagers.length > 0 ? (
              filteredManagers.map((m) => (
                <tr key={m._id}>
                  <td>{m.name || "-"}</td>
                  <td>{m.contactNumber || "-"}</td>
                  <td>{m.email || "-"}</td>
                  <td>{m.departmentId?.name || "-"}</td>
                   {/* <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(m._id)}
                    >
                      🗑 Delete
                    </button>
                  </td> */}
                  <td className="actions-cell">
                    <button
                      className="reset-btn"
                      onClick={() => handleResetPassword(m._id)}
                    >
                      🔑 Reset Password
                    </button>
                    <button className="edit-btn" onClick={() => handleEdit(m)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(m._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No managers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <AddManagerModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchManagers}
      />
       {/* ✅ Edit Manager Modal */}
      {isEditModalOpen && selectedManager && (
        <EditManagerModalForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          manager={selectedManager}
          onUpdated={fetchManagers}
        />
      )}
    </div>
  );
}

