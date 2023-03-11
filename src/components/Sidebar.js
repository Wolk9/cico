import React from "react";
import { FaBars, FaTh, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ children }) => {
  const menuItem = [
    { path: "/", name: "Home", icon: <FaTh /> },
    { path: "/user", name: "User", icon: <FaUser /> },
  ];

  return (
    <div className="ql-container">
      <div className="sidebar">
        <div className="top_section">
          <h1 className="logo">Logo</h1>
          <div className="bars">
            <FaBars />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};
