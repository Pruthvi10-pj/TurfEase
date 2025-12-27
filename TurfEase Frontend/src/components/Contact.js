import React, { useState } from "react";
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    city: "",
    reason: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseColor, setResponseColor] = useState("green");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason) {
      setResponseMessage("Please select a reason.");
      setResponseColor("red");
      return;
    }

    try {
      const response = await fetch("http://localhost:8787/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResponseMessage("Your message was sent successfully!");
        setResponseColor("green");
        setFormData({
          fullname: "",
          phone: "",
          email: "",
          city: "",
          reason: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        setResponseMessage(
          errorData.message || "Something went wrong. Please try again."
        );
        setResponseColor("red");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to server. Try again later.");
      setResponseColor("red");
    }
  };

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
        <h1 style={{ margin: 0 }}>Contact Us</h1>
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <h2 className="text-center mb-4 fw-bold">
                We'd Love to Hear From You!
              </h2>
              <p className="text-center text-muted">
                At TurfEase, we are committed to helping you connect, play, and
                enjoy. Whether you have questions, need assistance, or just want
                to reach out, we’re here to help.
              </p>
              <p className="text-center text-muted mb-4">
                Please fill the form below. Your feedback means a lot to us!
              </p>

              {/* Response Message */}
              {responseMessage && (
                <div
                  className={`text-center fw-semibold mb-3 text-${
                    responseColor === "red" ? "danger" : "success"
                  }`}
                >
                  {responseMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label htmlFor="fullname" className="form-label fw-semibold">
                      Full Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      maxLength="55"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      placeholder="Phone Number"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control shadow-sm"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength="70"
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label fw-semibold">
                      City <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      maxLength="30"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="reason" className="form-label fw-semibold">
                      Reason <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select shadow-sm"
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        -- Select Reason --
                      </option>
                      <option value="Payment_Or_Refund_related_issues">
                        Payment / Refund related issues
                      </option>
                      <option value="Feedback_regarding_Staff">
                        Feedback regarding Staff
                      </option>
                      <option value="Feedback_regarding_Venues">
                        Feedback regarding Venues
                      </option>
                      <option value="Suggestion_Regarding_Anything">
                        Suggestion Regarding Anything
                      </option>
                      <option value="Other_reason">Other reason</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Enter Message <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="form-control shadow-sm"
                      id="message"
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      maxLength="255"
                      placeholder="Enter your message here..."
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 text-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-warning px-5 py-2 fw-bold"
                    >
                      SEND MESSAGE
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
