import React, { useState } from "react";
import axios from "axios";
import "./AddUserForm.css";

const AddUserForm: React.FC<{ onHide: () => void; callAPIUpdateData: () => void }> = ({ onHide, callAPIUpdateData }) => {
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://backend-tradex.onrender.com/user/register", newUser);
      if (response.data.status) {
        callAPIUpdateData(); // Refresh user list
        onHide(); // Close popup
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="user-form">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={newUser.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={newUser.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-input">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={newUser.password} 
              onChange={handleChange} 
              required 
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <i className="fas fa fa-eye-slash"></i> :<i className="fas fa fa-eye"></i>}
            </button>
          </div>
        </div>
        
        <button type="submit" className="btn btn-success">Add User</button>
        <button type="button" className="btn btn-secondary" onClick={onHide}>Cancel</button>
      </form>
    </div>
  );
};

export default AddUserForm;
