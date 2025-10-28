import React, { useState } from "react";
import axios from "axios";
import "./ResetAssistantManagerPassword.css";
function ResetAssistantManagerPassword({ assistantId, onClose }) {
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    try {
      await axios.put(
        `https://rj-task-managment-rjatlas-server.vercel.app/api/assistant-managers/${assistantId}/reset-password`,
        { newPassword }
      );
      alert("Password reset successfully!");
      setNewPassword("");
      onClose();
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password");
    }
  };

  return (
    // <div className="reset-password-modal">
    //   <h3>Reset Password</h3>
    //   <input
    //     type="password"
    //     placeholder="Enter new password"
    //     value={newPassword}
    //     onChange={(e) => setNewPassword(e.target.value)}
    //   />
    //   <button onClick={handleReset}>Reset</button>
    //   <button onClick={onClose}>Cancel</button>
    // </div>

     <div className="reset-password-modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>Reset Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="note">Password must be at least 6 characters</div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default ResetAssistantManagerPassword;
