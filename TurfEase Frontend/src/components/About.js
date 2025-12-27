import React from "react";
import { Link } from "react-router";

export default function About() {
  return (
    <>
      <div
        className="text-white text-center"
        style={{
          backgroundColor: "#355E3B",
          height: "120px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>About Us</h1>
      </div>

      <div className="container py-5">
        {/* Intro Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/assets/TurfEase.jpg"
              className="img-fluid rounded shadow-sm"
              alt="about-turfzone"
              loading="lazy"
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">About TurfEase</h2>
            <p className="text-muted">
              Welcome to TurfEase, your all-in-one platform for discovering and
              booking sports turfs across your city. We are dedicated to making
              sports more accessible by eliminating the hassle of offline
              booking and scheduling.
            </p>
            <p className="text-muted">
              Built using React.js, Spring Boot, and MySQL, TurfEase empowers
              both players and turf owners through a clean, responsive and
              secure platform.
            </p>
          </div>
        </div>

        {/* Our History */}
        <div className="mb-5">
          <h2>Our History</h2>
          <hr />
          <p className="text-muted">
            The idea behind TurfEase was born in early 2024 when a group of
            sports enthusiasts struggled to find a reliable way to book turf
            grounds for evening matches. From a simple Excel sheet to a powerful
            web app, TurfEase has grown into a game-changer for the Indian
            sports community.
          </p>
          <p className="text-muted">
            We launched our beta in early 2025 with partners in Maharashtra,
            continuously improving based on real-world feedback.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-5">
          <h2>What We Offer</h2>
          <hr />
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <strong>Real-Time Turf Availability:</strong> Instantly view
              available slots.
            </li>
            <li className="mb-2">
              <strong>Easy Online Booking:</strong> Book slots with just a few
              clicks.
            </li>
            <li className="mb-2">
              <strong>Secure Payment Gateway:</strong> Pay using UPI, cards,
              wallets.
            </li>
            <li className="mb-2">
              <strong>Turf Management:</strong> Admin tools for turf owners to
              manage and grow.
            </li>
          </ul>
        </div>

        {/* Our Impact */}
        <div className="mb-5">
          <h2>Our Impact</h2>
          <hr />
          <p className="text-muted">
            Since launch, we've helped thousands of players and turf owners
            simplify their booking processes. We've enabled better visibility,
            transparency, and utilization of sports infrastructure across the
            country.
          </p>
        </div>

        {/* Join Us */}
        <div className="mb-5">
          <h2>Join Us</h2>
          <hr />
          <p className="text-muted">
            Whether you're a sports lover or a turf owner, TurfEase is built for
            you.
          </p>
          <ul className="text-muted">
            <li className="mb-2">
              🎮 <strong>For Players:</strong> Book your favorite slot
              instantly. Fast and secure!
            </li>
            <li className="mb-2">
              🏟️ <strong>For Turf Owners:</strong> Manage your business online
              and reach more customers.
            </li>
            <li className="mb-2">
              🚀 Be part of the change. Join the TurfEase movement today.
            </li>
          </ul>
          <p>
            <strong>
              Have questions? Reach out at{" "}
              <Link to="/contact">contact@turfEase.site</Link>
            </strong>
          </p>
        </div>
      </div>
    </>
  );
}
