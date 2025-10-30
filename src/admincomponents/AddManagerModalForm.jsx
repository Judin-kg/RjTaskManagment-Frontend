// import React, { useState } from "react";

// import "./AddManagerModalForm.css";
// import axios from "axios";

//  function AddManagerModalForm({ isOpen, onClose, onCreated }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "123456", // default password
//     contactNumber: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/api/managers", { ...form, role: "manager" });
//       setForm({ name: "", email: "", password: "123456", contactNumber: "" });
//       if (onCreated) onCreated(); // refresh manager list
//       onClose();
//     } catch (err) {
//       console.error("Error creating manager:", err);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Add Manager</h2>
//         <form onSubmit={handleSubmit} className="modal-form">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="contactNumber"
//             placeholder="Contact Number"
//             value={form.contactNumber}
//             onChange={handleChange}
//             required
//           />
//           <div className="modal-actions">
//             <button type="submit" className="save-btn">
//               Save
//             </button>
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default AddManagerModalForm; 




import React, { useState, useEffect } from "react";
import "./AddManagerModalForm.css";
import axios from "axios";

function AddManagerModalForm({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // default password
    contactNumber: "",
    departmentId: "", // NEW field
  });

  const [departments, setDepartments] = useState([]);

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://rjtaskmanagment-server.onrender.com/api/departments")
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error fetching departments:", err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rjtaskmanagment-server.onrender.com/api/managers", { ...form, role: "manager" });
      setForm({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        departmentId: "",
      });
      if (onCreated) onCreated(); // refresh manager list
      onClose();
    } catch (err) {
      console.error("Error creating manager:", err);
      alert("Failed to create manager");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Manager</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

           {/* Password field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />

          {/* Department Dropdown */}
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select Department</option>
            {departments?.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddManagerModalForm;
