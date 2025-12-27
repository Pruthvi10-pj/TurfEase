import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Payment() {
  const { state } = useLocation();
  const turf = state?.turf;
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today's date in yyyy-mm-dd format
    return new Date().toISOString().slice(0, 10);
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    // Fetch all bookings from backend
    fetch("http://localhost:8787/slotbookings/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter bookings for this turf and selected date
          const filtered = data.filter(
            (b) =>
              b.turf === turf.name &&
              b.time.startsWith(selectedDate) // checks date part of ISO string
          );
          // Map to array of booked slot times (full ISO string)
          setBookedSlots(filtered.map((b) => b.time));
        } else {
          setBookedSlots([]);
        }
      })
      .catch(() => setBookedSlots([]));
  }, [selectedDate, turf]);

  const isUserLoggedIn = () => {
    // Replace this with real authentication logic
    return !!localStorage.getItem("userToken"); // Example: Check if token exists
  };

  const handleSlotClick = (slot) => {
    if (!isUserLoggedIn()) {
      setShowAuthModal(true); // Show custom modal
      return;
    }
    // navigate to booking page with turf and slot info
    navigate("/book", { state: { turf, slot, selectedDate } });
  };

  if (!turf) {
    return <div className="text-center mt-5">No turf data available.</div>;
  }

  const isPastSlot = (slotDate, slotTime) => {
    const now = new Date();
    const selected = new Date(`${slotDate}T${slotTime}:00`);

    return selected < now;
  };

  // Filter slots by selectedDate
  const generateSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 24; // 12 AM

    for (let hour = startHour; hour < endHour; hour++) {
      const start = `${hour.toString().padStart(2, "0")}:00`;
      const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({ startTime: start, endTime: end });
    }

    return slots;
  };

  const allSlots = generateSlots();

  function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  }

  return (
    <>
      {/* Page Header */}
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
        <h1 style={{ margin: 0 }}>Payment</h1>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-7">
            <div className="card shadow rounded-4 border-0 h-100">
              <img
                src={
                  turf.image ||
                  "https://via.placeholder.com/600x300?text=No+Image"
                }
                alt={turf.name}
                className="card-img-top rounded-top-4"
                style={{ height: "400px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h2 className="fw-bold mb-2">{turf.name}</h2>
                <p className="text-muted">📍 {turf.location}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-5">
            <div className="p-4 border rounded shadow bg-light">
              <h5 className="fw-bold mb-3">Select Date</h5>
              <input
                type="date"
                className="form-control mb-4"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />

              <h5 className="fw-bold mb-3">Available Slots</h5>
              <div className="row g-2">
                {allSlots.map((slot, index) => {
                  // Construct full ISO time string for this slot
                  const slotTime = `${selectedDate}T${slot.startTime}:00`;
                  const isPast = isPastSlot(selectedDate, slot.startTime);
                  const isBooked = bookedSlots.includes(slotTime);

                  return (
                    <div key={index} className="col-6 col-md-4">
                      <button
                        className={`w-100 text-white text-center rounded px-2 py-2 small fw-semibold border-0 ${
                          isBooked
                            ? "bg-primary"
                            : isPast
                            ? "bg-secondary"
                            : "bg-success"
                        }`}
                        style={{
                          fontSize: "0.85rem",
                          cursor: isPast || isBooked ? "not-allowed" : "pointer",
                        }}
                        onClick={() => !isPast && !isBooked && handleSlotClick(slot)}
                        disabled={isPast || isBooked}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="mt-5">
          <h5 className="fw-bold mb-3">Location</h5>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              turf.address
            )}&output=embed`}
            width="100%"
            height="350"
            style={{ border: "0", borderRadius: "12px" }}
            allowFullScreen=""
            loading="lazy"
            title="Google Maps"
          ></iframe>
        </div>
      </div>

      {/* Custom Bootstrap Modal */}
      {showAuthModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowAuthModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please login to continue booking your slot.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowAuthModal(false);
                    window.location.href = "/login";
                  }}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
