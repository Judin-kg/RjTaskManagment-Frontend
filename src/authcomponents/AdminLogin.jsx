import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';
import taskimage3 from '../utils/Taskimanagment3.png';
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
     setLoading(true);
    try {
      const res = await axios.post('https://rjtaskmanagment-server.onrender.com/api/auth/admin-login', formData);
      console.log(res,"ressss");
      
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        setMessage('Access denied. You are not an admin.');
         setLoading(false);
        return;
      }

      if (user.status === 'blocked') {
        setMessage('Your account is blocked.');
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to admin panel
      window.location.href = '/admin';

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="container mt-5" style={{ maxWidth: '400px' }}>
    //   <h2>Admin Login</h2>
    //   {message && <div className="alert alert-danger">{message}</div>}
    //   <form onSubmit={handleSubmit}>
    //     <div className="mb-3">
    //       <label>Email</label>
    //       <input
    //         name="email"
    //         type="email"
    //         className="form-control"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //       />
    //     </div>
    //     <div className="mb-3">
    //       <label>Password</label>
    //       <input
    //         name="password"
    //         type="password"
    //         className="form-control"
    //         value={formData.password}
    //         onChange={handleChange}
    //         required
    //       />
    //     </div>
    //     <button className="btn btn-dark w-100" type="submit">
    //       Login as Admin
    //     </button>
    //   </form>
    // </div>

     <div className="admin-login-container" style={{
        backgroundImage: `url(${taskimage3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
      <div style={{backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1rem', boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease-in-out'}}>
        <h2 className="admin-login-title" style={{color:"silver"}}>Admin Login</h2>

        {message && <div className="admin-login-error">{message}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;