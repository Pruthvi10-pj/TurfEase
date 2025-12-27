import React from "react";
import { Link } from "react-router";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer text-light pt-5" style={{ backgroundColor: "#587653" }}>
      <div className="container">
        <div className="row gy-4">
          {/* About Us */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">About Us</h5>
            <p className="small">
              Discover and book sports turfs instantly with TurfZone – your all-in-one platform for
              hassle-free scheduling, real-time availability, and secure payments. Built with
              React.js and Spring Boot to connect players and turf owners seamlessly!
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/event" className="footer-link">Event</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-12">
            <h5 className="footer-title">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt"></i> TurfEase
              </li>
              <li className="mb-2">
                <i className="fas fa-phone-alt"></i> +91 98898 989898
              </li>
              <li>
                <a
                  href="mailto:contact@turfEase.site"
                  className="footer-link"
                >
                  <i className="fas fa-envelope"></i> contact@turfEase.site
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center py-3 mt-4" style={{ backgroundColor: "#446e3d" }}>
        <small>© {new Date().getFullYear()} TurfEase. All rights reserved.</small>
      </div>
    </footer>
  );
}
