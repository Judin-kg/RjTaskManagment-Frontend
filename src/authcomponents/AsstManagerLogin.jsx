// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./ManagerLogin.css"; // ✅ import CSS file

// export default function AsstManagerLogin() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post("http://localhost:3000/api/managers/login", form);
//       localStorage.setItem("managerToken", res.data.token);
//       localStorage.setItem("manager", JSON.stringify(res.data.manager));
//       navigate("/manager/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <div className="manager-login-container">
//       <div className="manager-login-card">
//         <h2 className="manager-login-title"> Asst Manager Login</h2>

//         {error && <p className="manager-login-error">{error}</p>}

//         <form onSubmit={handleSubmit} className="manager-login-form">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" className="manager-login-btn">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssistantManagerLogin.css"; // ✅ import CSS file

export default function AsstManagerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
     setLoading(true);
    try {
      const res = await axios.post("https://rjtaskmanagment-server.onrender.com/api/assistant-managers/login", form);
      localStorage.setItem("assistantManagerToken", res.data.token);
      localStorage.setItem("assistantManager", JSON.stringify(res.data.assistantManager));
      navigate("/asstmanager/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-manager-login-container" style={{backgroundImage: 'url(https://www.usemotion.com/cdn-cgi/image/onerror=redirect,width=1400,height=780,format=webp/https://uploads-ssl.webflow.com/62fcfcf2e1a4c21ed18b80e6/64777b497a8679ea58687ee6_4ong0wvlcd.png)', backgroundSize: 'cover', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%'}}>
      <div className="assistant-manager-login-card"  style={{backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1rem', boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease-in-out'}}>
        <h2>Assistant Manager Login</h2>

        {error && <p className="assistant-manager-login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="assistant-manager-login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="assistant-manager-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login as Asst Manager"}
          </button>
        </form>
      </div>
    </div>
  );
}
