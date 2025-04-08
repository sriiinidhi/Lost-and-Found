import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/home");
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Navbar Styling
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "10px 50px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    height: "60px",
  };

  // "NITC Lost & Found" Styling
  const titleStyle = {
    color: "black",
    fontWeight: "bold",
    fontSize: "18px",
    textDecoration: "none",
  };

  // Link Container Styling
  const linkContainerStyle = {
    display: !isSmallScreen ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    gap: "30px",
  };

  // Default Link Styling
  const linkStyle = {
    color: "black", // ✅ Ensure text is always black
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  };

  // Active Link Styling
  const getActiveStyle = (path) => ({
    color: location.pathname === path ? "red" : "black",
    textDecoration: location.pathname === path ? "underline" : "none",
  });

  // Mobile Menu Icon
  const iconStyle = {
    cursor: "pointer",
    display: isSmallScreen ? "block" : "none",
  };

  // Mobile Dropdown Menu
  const menuStyle = {
    display: isSmallScreen ? (menuOpen ? "flex" : "none") : "none",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    top: "72px",
    left: "0",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
    padding: "10px 0",
  };

  return (
    <div style={navbarStyle}>
      {/* Left - NITC Lost & Found */}
      <Link to="#" style={titleStyle}>
        <span style={{ color: "red" }}>NITC</span> Lost & Found
      </Link>

      {/* Center - Navigation Links */}
      <div style={linkContainerStyle}>
        <Link to="/home" style={{ ...linkStyle, ...getActiveStyle("/home") }}>
          Home
        </Link>
        {user && (
          <>
            <Link to="/my-items" style={{ ...linkStyle, ...getActiveStyle("/my-items") }}>
              My Items
            </Link>
            <Link to="/all-items" style={{ ...linkStyle, ...getActiveStyle("/all-items") }}>
              All Items
            </Link>
            <Link to="/all-items/lost" style={{ ...linkStyle, ...getActiveStyle("/all-items/lost") }}>
              Lost
            </Link>
            <Link to="/all-items/found" style={{ ...linkStyle, ...getActiveStyle("/all-items/found") }}>
              Found
            </Link>
            <Link to="/raise-a-concern" style={{ ...linkStyle, ...getActiveStyle("/raise-a-concern") }}>
              Raise a Concern
            </Link>
            <Link to="/helpers" style={{ ...linkStyle, ...getActiveStyle("/helpers") }}>
              Helpers
            </Link>
            <Link to="/claimants" style={{ ...linkStyle, ...getActiveStyle("/claimants") }}>
              Claimers
            </Link>
            <Link to="/" style={{ ...linkStyle, ...getActiveStyle("/") }} onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/sign-up" style={{ ...linkStyle, ...getActiveStyle("/sign-up") }}>
              Sign Up
            </Link>
            <Link to="/sign-in" style={{ ...linkStyle, ...getActiveStyle("/sign-in") }}>
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <span style={iconStyle} onClick={handleToggleMenu}>
        {menuOpen ? "✕" : "☰"}
      </span>

      {/* Mobile Dropdown Menu */}
      <div style={menuStyle}>
        <Link to="/home" style={{ ...linkStyle, ...getActiveStyle("/home") }}>
          Home
        </Link>
        {user && (
          <>
            <Link to="/my-items" style={{ ...linkStyle, ...getActiveStyle("/my-items") }}>
              My Items
            </Link>
            <Link to="/all-items" style={{ ...linkStyle, ...getActiveStyle("/all-items") }}>
              All Items
            </Link>
            <Link to="/all-items/lost" style={{ ...linkStyle, ...getActiveStyle("/all-items/lost") }}>
              Lost
            </Link>
            <Link to="/all-items/found" style={{ ...linkStyle, ...getActiveStyle("/all-items/found") }}>
              Found
            </Link>
            <Link to="/raise-a-concern" style={{ ...linkStyle, ...getActiveStyle("/raise-a-concern") }}>
              Raise a Concern
            </Link>
            <Link to="/helpers" style={{ ...linkStyle, ...getActiveStyle("/helpers") }}>
              Helpers
            </Link>
            <Link to="/claimants" style={{ ...linkStyle, ...getActiveStyle("/claimants") }}>
              Claimers
            </Link>
            <Link to="/" style={{ ...linkStyle, ...getActiveStyle("/") }} onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/sign-up" style={{ ...linkStyle, ...getActiveStyle("/sign-up") }}>
              Sign Up
            </Link>
            <Link to="/sign-in" style={{ ...linkStyle, ...getActiveStyle("/sign-in") }}>
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
