import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import taskimage from '../utils/Taskmanagment.png';
import './StaffLogin.css';
const StaffLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
   setLoading(true);
    try {
      const res = await axios.post('https://rjtaskmanagment-server.onrender.com/api/auth/login', formData);
      const { token, user } = res.data;

      if (user.status === 'blocked') {
        setMessage('Your account has been blocked by the admin.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to the respective dashboard
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/staff/dashboard');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setMessage(errorMsg);
    }finally {
      setLoading(false);
    }
  };

  return (
    // <div className="container mt-5" style={{ maxWidth: '400px' }}>
    //   <h2 className="mb-4">Login</h2>

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

    //     <button className="btn btn-success w-100" type="submit">Login</button>
    //   </form>

    //   <div className="mt-3 text-center">
    //     <span>Don't have an account? </span>
    //     <Link to="/signup">Sign Up</Link>
    //   </div>
    // </div>

        <div className="admin-login-container"  style={{
        backgroundImage: `url(${taskimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
      <div style={{backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1rem', boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease-in-out'}}>
        <h2 className="admin-login-title" style={{color:"silver"}}> Staff Login</h2>

        {message && <div className="admin-login-error">{message}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
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

          <button className="admin-login-btn" type="submit" disabled={loading} >
           {loading ? "Logging in..." : "Login as Staff"}
          </button>
        </form>

        {/* <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div> */}
      </div>
    </div>


  
  );
};

export default StaffLogin;