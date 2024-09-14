import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active text-primary" : "nav-link text-white"
              }
              to="/admin/dashboard"
            >
              <i className="bi bi-house-door-fill"></i> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active text-primary" : "nav-link text-white"
              }
              to="/admin/invoices"
            >
              <i className="bi bi-people-fill"></i> Invoice
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active text-primary" : "nav-link text-white"
              }
              to="/admin/sacks"
            >
              <i className="bi bi-card-checklist"></i> Sack
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active text-primary" : "nav-link text-white"
              }
              to="/admin/powders"
            >
              <i className="bi bi-gear-fill"></i> Tea-Leaf Powder
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active text-primary" : "nav-link text-white"
              }
              to="/admin/packets"
            >
              <i className="bi bi-gear-fill"></i> Packet
            </NavLink>
          </li>
        </ul>
      </div>
  );
}

export default Sidebar;
