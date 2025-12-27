import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-white text-center">
        <div className="container">
          <h1 className="hero-title fw-bold">TurfEase</h1>
          <p className="hero-subtitle">Book Your Turf with Ease & Convenience</p>
          <a href="#about-section" className="btn btn-warning btn-lg mt-3">Learn More</a>
        </div>
      </div>

      {/* Carousel */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/turfimg2.jfif" className="d-block w-100 carousel-img" alt="Turf 1" />
          </div>
          <div className="carousel-item">
            <img src="/assets/turfimg1.jfif" className="d-block w-100 carousel-img" alt="Turf 2" />
          </div>
          <div className="carousel-item">
            <img src="/assets/turfimg3.jfif" className="d-block w-100 carousel-img" alt="Turf 3" />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* About Section */}
      <div id="about-section" className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="/assets/TurfEase.jpg"
              className="img-fluid rounded shadow-sm about-img"
              alt="About TurfEase"
            />
          </div>
          <div className="col-lg-6">
            <h2 className="text-success mb-3">About Us</h2>
            <hr style={{ width: "60px", height: "4px", backgroundColor: "#F4C430", border: "none" }} />
            <p className="text-muted">
              TurfEase is your go-to platform for discovering and booking sports turfs across the city.
              Whether you're a player looking for available slots or a turf owner wanting to streamline
              operations — we've got you covered. Enjoy real-time availability, easy payments, and secure
              online bookings from the comfort of your home.
            </p>
            <a href="#features" className="btn btn-outline-success mt-3">Explore Features</a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-5 text-white" style={{ backgroundColor: "#1f2937" }}>
        <div className="container text-center">
          <h2 className="mb-5">Why Choose TurfEase?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-dark rounded shadow h-100">
                <h5 className="text-warning">Instant Booking</h5>
                <p>Book your preferred slots instantly with live availability and confirmations.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-dark rounded shadow h-100">
                <h5 className="text-info">Real-time Payments</h5>
                <p>Make payments securely with instant feedback and booking receipts.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-dark rounded shadow h-100">
                <h5 className="text-danger">For Turf Owners</h5>
                <p>Manage slots, track users, and update turf availability with ease.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-5 bg-light text-center">
        <div className="container">
          <h2>Ready to Play?</h2>
          <p className="lead text-muted">Find and book a turf near you today!</p>
          <a href="/event" className="btn btn-success btn-lg mt-2">View Turfs</a>
        </div>
      </div>
    </>
  );
}