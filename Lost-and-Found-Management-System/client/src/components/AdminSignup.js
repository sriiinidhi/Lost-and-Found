import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

function AdminSignup() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password !== "admin") {
      alert("Password must be 'admin' to register as an administrator.");
      return;
    }

    setLoading(true);

    const data = {
      adminId: adminId,
      username: email,
      password: password,
    };

    try {
      const res = await axios.post(`${Base_URL}/admin/signup`, data);

      if (res.status === 201) {
        alert("Admin registered successfully. Proceed to login.");
        navigate("/admin-sign-in");
      } else {
        alert("Admin signup failed.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Admin already exists. Please try a different ID/email.");
      } else {
        console.error("Signup error:", error.response?.data || error.message);
        alert("Something went wrong during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="card signup-card">
        <h2>Admin Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="adminId">Admin ID:</label>
            <input
              type="text"
              id="adminId"
              name="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Register as Admin"}
          </button>
          <p className="btn-spread">Back to user sign up?</p>
          <button
            type="button"
            className="submit-button"
            onClick={() => navigate("/sign-up")}
          >
            {loading ? <Spinner /> : "User Sign Up"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminSignup;
