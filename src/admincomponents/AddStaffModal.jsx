// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./AddStaffModal.css";
// import { useNavigate } from "react-router-dom";

// export default function AddStaffModal({ isOpen, onClose, onCreated }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     assistantManager: '',
//     contactNumber: '',
//     password: '',
//   });
//   const navigate = useNavigate();

//   const [message, setMessage] = useState('');
//   const [assistantManagers, setAssistantManagers] = useState([]);
//   useEffect(() => {
//     if (isOpen) {
//       axios
//         .get("https://task-managment-server-neon.vercel.app/api/assistant-managers")
//         .then((res) => setAssistantManagers(res.data))
//         .catch((err) =>
//           console.error("Error fetching assistant managers:", err)
//         );
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       await axios.post("https://task-managment-server-neon.vercel.app/api/auth/register", form);
// //       setForm({ name: "", email: "", contactNumber: "", role: "staff", password: "" });
// //       if (onCreated) onCreated(); // Refresh staff list
// //       onClose(); // Close modal
// //     } catch (err) {
// //       console.error("Error adding staff:", err);
// //       alert("Failed to add staff.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       const res = await axios.post('https://task-managment-server-neon.vercel.app/api/auth/signup', formData);
//       setMessage(res.data.message || 'Signup successful!');
//        if (res.data.success) {
//         // ✅ Redirect after short delay or immediately
//         navigate("/");
//       }
//       setFormData({ name: '', email: '', password: '',assistantManager: '',contactNumber: '', });
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Signup failed');
//     }
//   };
//   if (!isOpen) return null;

//   return (
//     // <div className="modal-overlay">
//     //   <div className="modal-content">
//     //     <h2>Add New Staff</h2>
//     //     <form className="modal-form" onSubmit={handleSubmit}>
//     //       <input
//     //         type="text"
//     //         name="name"
//     //         placeholder="Full Name"
//     //         value={form.name}
//     //         onChange={handleChange}
//     //         required
//     //       />
//     //       <input
//     //         type="email"
//     //         name="email"
//     //         placeholder="Email"
//     //         value={form.email}
//     //         onChange={handleChange}
//     //         required
//     //       />
//     //       <input
//     //         type="text"
//     //         name="contactNumber"
//     //         placeholder="Contact Number"
//     //         value={form.contactNumber}
//     //         onChange={handleChange}
//     //       />

//     //       {/* Password Field with Show/Hide */}
//     //       <div className="password-wrapper">
//     //         <input
//     //           type={showPassword ? "text" : "password"}
//     //           name="password"
//     //           placeholder="Password"
//     //           value={form.password}
//     //           onChange={handleChange}
//     //           required
//     //         />
//     //         <button
//     //           type="button"
//     //           className="toggle-password"
//     //           onClick={() => setShowPassword(!showPassword)}
//     //         >
//     //           {showPassword ? "🙈" : "👁️"}
//     //         </button>
//     //       </div>

//     //       <select name="role" value={form.role} onChange={handleChange}>
//     //         <option value="staff">Staff</option>
//     //         <option value="assistantmanager">Assistant Manager</option>
//     //         <option value="manager">Manager</option>
//     //       </select>

//     //       <div className="modal-actions">
//     //         <button type="submit" className="save-btn" disabled={loading}>
//     //           {loading ? "Saving..." : "Save"}
//     //         </button>
//     //         <button type="button" className="cancel-btn" onClick={onClose}>
//     //           Cancel
//     //         </button>
//     //       </div>
//     //     </form>
//     //   </div>
//     // </div>

//     <div className="admin-login-container">
//       <div className="admin-login-card">
//         <h2 className="admin-login-title">Sign Up</h2>

//         {message && <div className="alert alert-info">{message}</div>}

//         <form className="admin-login-form" onSubmit={handleSubmit}>
//           <input
//             name="name"
//             type="text"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <select
//             name="assistantManager"
//             value={formData.assistantManager}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Assistant Manager</option>
//             {assistantManagers.map((am) => (
//               <option key={am._id} value={am._id}>
//                 {am.name}
//               </option>
//             ))}
//           </select>

//           <input
//             name="contactNumber"
//             type="text"
//             placeholder="Contact Number"
//             value={formData.contactNumber}
//             onChange={handleChange}
//             required
//           />

//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button className="admin-login-btn" type="submit">Sign Up</button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddStaffModal.css";

export default function AddStaffModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    assistantManager: "",
    contactNumber: "",
    password: "",
  });

  const [assistantManagers, setAssistantManagers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch assistant managers when modal opens
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://rj-task-managment-rjatlas-server.vercel.app/api/assistant-managers")
        .then((res) => setAssistantManagers(res.data))
        .catch((err) =>
          console.error("Error fetching assistant managers:", err)
        );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://rj-task-managment-rjatlas-server.vercel.app/api/auth/signup",
        formData
      );

      setMessage(res.data.message || "staff successful!");
      if (res.data.success) {
        if (onCreated) onCreated(); // ✅ Refresh parent staff list
        setTimeout(() => {
          onClose(); // Close modal after success
        }, 800);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        assistantManager: "",
        contactNumber: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2>Add New Staff</h2>
        {message && <div className="alert-message">{message}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="assistantManager"
            value={formData.assistantManager}
            onChange={handleChange}
            required
          >
            <option value="">Select Assistant Manager</option>
            {assistantManagers?.map((am) => (
              <option key={am._id} value={am._id}>
                {am.name}
              </option>
            ))}
          </select>

          <input
            name="contactNumber"
            type="text"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button className="save-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
