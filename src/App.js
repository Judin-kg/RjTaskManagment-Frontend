// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">

//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



import AdminLogin from './authcomponents/AdminLogin';

import Navabar from './components/Navabar';
import StaffLogin from './authcomponents/StaffLogin';
import StaffSignup from './authcomponents/StaffSignup';
import AdminDashboard from './admincomponents/AdminDashboard';

import ManagerLogin from './authcomponents/ManagerLogin';
import ManagerDashboard from './managercomponents/ManagerDashboard';
import AsstManagerLogin from './authcomponents/AsstManagerLogin';
import AssistantManagerDashboard from './assistantmanagercomponents/AsstManagerDashboard';
// import StaffDashboard from './staffcomponents/StaffDashboard';
import StaffSidebar from './staffcomponents/StaffSidebar';

// import ManagerLogin from './manager/ManagerLogin';


// Protect private routes (basic token check)
// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" />;
// };

// Only allow admins
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'admin' ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    

    <Router>
      <Navabar />
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<StaffSignup/>} />
        <Route path="/" element={<StaffLogin />} />
         <Route path="/staff/dashboard" element={<StaffSidebar />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/asstmanager-login" element={<AsstManagerLogin />} />
        <Route path="/asstmanager/dashboard" element={<AssistantManagerDashboard />} />

        {/* <Route path="/manager-login" element={<ManagerLogin />} /> */}
        {/* <Route path="/cart" element={<CartList />} /> */}
        {/* User Routes */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        {/* <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} /> */}

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        {/* manager Routes */}
        {/* <Route path="/manager" element={<AdminRoute><ManagerDashboard /></AdminRoute>} /> */}
        
        {/* <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
        {/* Default Route */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
