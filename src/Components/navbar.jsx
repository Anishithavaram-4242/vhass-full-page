import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./navbar.css";
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthCheck } from "../hooks/useAuthCheck.js";

function Navbar() {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();
  const { user } = useAuthCheck();

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty("--x", `${x}%`);
    button.style.setProperty("--y", `${y}%`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header>
      <div className="navbar">
        <div className="brand" onClick={() => navigate("/")}>
          <img src="VHASS.png" alt="VHASS Logo" className="logo" />
          <h1>VHASS</h1>
        </div>

        <nav>
          <ul>
            <li><button className="nav-libtn" onClick={() => navigate("/")} onMouseMove={handleMouseMove}>Home</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/course")} onMouseMove={handleMouseMove}>Courses</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/workshop")} onMouseMove={handleMouseMove}>Workshop</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/Entrepreneur")} onMouseMove={handleMouseMove}>Entrepreneur</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/Services")} onMouseMove={handleMouseMove}>Services</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/aboutus")} onMouseMove={handleMouseMove}>About Us</button></li>
            <li><button className="nav-libtn" onClick={() => navigate("/helpdesk")} onMouseMove={handleMouseMove}>Help Desk</button></li>
            
          </ul>
        </nav>

        <div className="user-menu">
          {loading ? (
            <div style={{ color: 'white', fontSize: '14px' }}>Loading...</div>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button className="login" onClick={() => navigate("/dashboard")} onMouseMove={handleMouseMove}>Dashboard</button>
              {user.role === 'admin' && (
                <button className="login" onClick={() => navigate("/admin")} onMouseMove={handleMouseMove} style={{ backgroundColor: '#B88AFF', color: '#000000' }}>Admin</button>
              )}
            
            </div>
          ) : (
            <button className="login" onClick={() => navigate("/auth")} onMouseMove={handleMouseMove}>LOGIN</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
