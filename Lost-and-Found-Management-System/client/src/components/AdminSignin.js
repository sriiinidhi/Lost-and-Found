import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

function AdminSignin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      username: username,
      password: password,
    };

    try {
      const res = await axios.post(`${Base_URL}/admin/login`, data, {
        withCredentials: true,
      });

      if (res.status === 401) {
        alert("Invalid Credentials");
        return;
      }

      const token = res.data.token;
      localStorage.setItem("adminToken", token);

      alert("Admin signed in successfully!");
      navigate("/admin/dashboard"); // Adjust to your actual route
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signin-container">
        <h2>Admin Sign In</h2>
        <p style={{ color: "grey" }}>Enter admin credentials to continue</p>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your admin username"
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
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <button
            className="btn-signin"
            onClick={handleAdminSignIn}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign In as Admin"}
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSignin;
