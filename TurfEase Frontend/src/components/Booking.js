import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Modal from 'react-bootstrap/Modal'; // If using react-bootstrap
import Button from 'react-bootstrap/Button';
// Inline toast to match Dashboard/Login style

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const turf = state?.turf;
  const slot = state?.slot;
  const selectedDate = state?.selectedDate;

  // Prefill from localStorage only on first render, checking multiple possible keys
  const [name, setName] = useState(() =>
    localStorage.getItem("userFullName") ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("name") ||
    ""
  );
  const [email, setEmail] = useState(() =>
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    ""
  );
  const [phone, setPhone] = useState(() =>
    localStorage.getItem("userPhone") ||
    localStorage.getItem("phoneNumber") ||
    localStorage.getItem("phone") ||
    ""
  );

  const [bookedSlots, setBookedSlots] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  // Local toast state
  const [toast, setToast] = useState({ show: false, type: "success", message: "", position: "top" });
  const toastRef = useRef(null);
  const showToast = (message, type = "success", position = "top") => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast({ show: true, type, message, position });
    toastRef.current = setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  // Ensure autofill from server profile if logged in and fields missing
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const emailFromStorage = localStorage.getItem("userEmail") || localStorage.getItem("email");
    if (!token || !emailFromStorage) return;
    // Only fetch if we are missing either name or phone
    if (name && phone) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/User", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const allUsers = await res.json();
        if (!Array.isArray(allUsers)) return;
        const currentUser = allUsers.find(u =>
          u.userEmail === emailFromStorage ||
          u.email === emailFromStorage ||
          u.userEmail?.toLowerCase?.() === emailFromStorage?.toLowerCase?.() ||
          u.email?.toLowerCase?.() === emailFromStorage?.toLowerCase?.()
        );
        if (currentUser) {
          if (!name) {
            const fullName = currentUser.fullName || currentUser.name || "";
            if (fullName) {
              setName(fullName);
              try { localStorage.setItem("userFullName", fullName); } catch (e) {}
            }
          }
          if (!phone) {
            const phoneVal = currentUser.phoneNumber || currentUser.phone || "";
            if (phoneVal) {
              setPhone(String(phoneVal));
              try { localStorage.setItem("userPhone", String(phoneVal)); } catch (e) {}
            }
          }
        }
      } catch (e) {
        // Fail silently; fields remain user-editable
      }
    };
    fetchUser();
  }, [name, phone]);

  useEffect(() => {
    // Fetch all booked slots
    fetch("http://localhost:8787/slotbookings/all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter for current turf and date, and map to booked slot times
          const filtered = data.filter(
            b =>
              b.turfName === turf.name &&
              b.date === selectedDate
          );
          // Map to array of booked slot startTimes (assuming backend has startTime)
          // If backend stores time as "2025-09-11T10:00:00", extract startTime from it
          setBookedSlots(filtered.map(b => b.time)); // b.time should match slotTime format below
        } else {
          setBookedSlots([]);
        }
      })
      .catch(() => setBookedSlots([]));
  }, [selectedDate, turf]);

  if (!turf || !slot) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No slot selected. Please pick a slot from a turf page.</div>
      </div>
    );
  }

  const timeLabel = `${slot.startTime} - ${slot.endTime}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPendingBooking({
      name,
      email,
      phone,
      date: selectedDate,
      time: timeLabel,
      turf: turf.name,
    });
    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirm(false);
    // Build booking payload matching your backend entity expected fields
    const payload = {
      name,
      email,
      phoneNumber: Number(phone), // ensure phoneNumber is sent as a number
      time: `${selectedDate}T${slot.startTime}:00`,
      turf: turf.name || turf.turf || turf,
    };

    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // try primary endpoint first, fallback to legacy endpoint path seen in logs
      const endpoints = [
        "/api/slotBookings",
        "/slotbookings/create",
      ];

      let res;
      for (const url of endpoints) {
        console.log("Trying booking endpoint:", url);
        res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        // accept 201/200 as success; otherwise try next endpoint
        if (res.ok) break;
      }

      if (!res.ok) {
        let errorText = null;
        try {
          const json = await res.json();
          errorText = json.message || JSON.stringify(json);
        } catch (e) {
          errorText = await res.text();
        }
        console.error("Booking failed, status:", res.status, "body:", errorText);
        alert(`Booking failed: ${errorText} (status ${res.status})`);
        return;
      }

      const created = await res.json();
      console.log("Booking created:", created);
      // persist latest user info to localStorage for profile/autofill
      if (name) localStorage.setItem("userFullName", name);
      if (email) localStorage.setItem("userEmail", email);
      if (phone) localStorage.setItem("userPhone", phone);

      // Persist latest user info to localStorage for future autofill
      if (name) localStorage.setItem("userFullName", name);
      if (email) localStorage.setItem("userEmail", email);
      if (phone) localStorage.setItem("userPhone", phone);

      // Show success toast here and navigate after a brief delay
      showToast("Booking successful!", "success", "top");
      setTimeout(() => {
        navigate("/profile", {
          state: {
            toast: { message: "Booking successful!", type: "success", position: "top" },
          },
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.error("Network or unexpected error:", error);
      alert(`Booking failed, network error: ${error.message}`);
    }
  };

  // const handleSlotSelect = (slot) => {
  //   // Your logic to handle slot selection
  //   // For example, set selected slot in state
  //   // setSelectedSlot(slot);
  // };

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
        <h1 style={{ margin: 0 }}>Book Slot</h1>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 mb-4">
              <img src={turf.image || "/assets/turfimg1.jfif"} alt={turf.name} className="card-img-top" style={{ height: 300, objectFit: 'cover' }} />
              <div className="card-body">
                <h3 className="fw-bold">{turf.name}</h3>
                <p className="text-muted">📍 {turf.location || turf.address}</p>
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {timeLabel}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="mb-3">Your details</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input value={phone} maxLength="10" onChange={e => setPhone(e.target.value)} className="form-control" required />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">Book</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            {/* <h4 className="mb-3">Available Slots</h4> */}
            <div className="d-flex flex-wrap gap-2">
              {turf.slots && turf.slots.map(slot => {
                // Construct slotTime string to match backend format
                const slotTime = `${selectedDate}T${slot.startTime}:00`;
                const isBooked = bookedSlots.includes(slotTime);
                return (
                  <button
                    key={slot.id}
                    style={{
                      backgroundColor: isBooked ? "#007bff" : "#28a745",
                      color: "#fff",
                      cursor: isBooked ? "not-allowed" : "pointer",
                      margin: "5px"
                    }}
                    disabled={isBooked}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {pendingBooking?.name}</p>
          <p><strong>Email:</strong> {pendingBooking?.email}</p>
          <p><strong>Phone:</strong> {pendingBooking?.phone}</p>
          <p><strong>Date:</strong> {pendingBooking?.date}</p>
          <p><strong>Time:</strong> {pendingBooking?.time}</p>
          <p><strong>Turf:</strong> {pendingBooking?.turf}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Local Toast */}
      {toast.show && (() => {
        const containerStyle = toast.position === "center"
          ? { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }
          : { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 2000 };
        return (
          <div style={containerStyle}>
            <div className={`alert alert-${toast.type} shadow mb-0`} role="alert">
              {toast.message}
            </div>
          </div>
        );
      })()}
    </>
  );
}
