import React from "react";
import "./Header.css";
import { Link, useLocation } from "react-router";

export default function Header() {
  const location = useLocation();

  const handleNavLinkClick = () => {
    const navCollapse = document.getElementById("navbarSupportedContent");
    if (navCollapse && navCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navCollapse, {
        toggle: true,
      });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/assets/TurfEaseShort.jpg"
            alt="logo"
            style={{ height: "50px", width: "50px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                to="/about"
              >
                ABOUT US
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/event" ? "active" : ""
                }`}
                to="/event"
              >
                EVENT
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
                to="/contact"
              >
                CONTACT US
              </Link>
            </li>
            <li className="nav-item">
              {localStorage.getItem("userToken") ? (
                <Link
                  className={`nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  to="/profile"
                  onClick={handleNavLinkClick}
                >
                  PROFILE
                </Link>
              ) : (
                <Link
                  className={`nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  to="/login"
                  onClick={handleNavLinkClick}
                >
                  LOGIN
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
