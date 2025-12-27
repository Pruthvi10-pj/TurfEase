import React, { useState, useRef } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useLocation, useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [showAllTurfs, setShowAllTurfs] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const [turfs, setTurfs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    location: "",
    price: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // UI state for edit/delete modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    location: "",
    price: "",
    image: "",
  });

  // Booking edit state
  const [editBooking, setEditBooking] = useState(null);
  const [editBookingForm, setEditBookingForm] = useState({
    name: "",
    turf: "",
    time: "",
  });

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
    position: "top",
  });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = "success", position = "top") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, type, message, position });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Show arrival toast if navigated with state (e.g., login success)
  React.useEffect(() => {
    if (!location || !location.state?.toast) return;
    const { message, type = "success", position = "top" } = location.state.toast;
    showToast(message, type, position);
    // Remove state to avoid replay on back/forward
    try {
      navigate(window.location.pathname, { replace: true });
    } catch (e) {}
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitMessage({ type: "", text: "" });
      // Build payload that supports both lowercase and legacy UPPERCASE keys
      const payloadLower = {
        ...formData,
        price: formData.price === "" ? "" : Number(formData.price),
      };
      if (!payloadLower.id) {
        delete payloadLower.id;
      }
      const payload = {
        ...payloadLower,
        ...(payloadLower.id !== undefined ? { Id: payloadLower.id } : {}),
        Name: payloadLower.name,
        Address: payloadLower.address,
        Price: payloadLower.price,
      };
      await axios.post("http://localhost:8787/turfs", payload);
      setSubmitMessage({ type: "success", text: "Turf added successfully!" });
      showToast("Turf added successfully!", "success");
      setFormData({
        id: "",
        name: "",
        address: "",
        location: "",
        price: "",
        image: "",
      });
      setShowForm(false);
      fetchTurfs();
    } catch (error) {
      setSubmitMessage({
        type: "danger",
        text: "Error adding turf. Please try again.",
      });
      showToast("Failed to add turf. Please try again.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit modal handlers
  const openEditModal = (turf) => {
    setSelectedTurf(turf);
    setEditForm({
      name: turf.name ?? turf.Name ?? "",
      address: turf.address ?? turf.Address ?? "",
      location: turf.location ?? turf.Location ?? "",
      price: turf.price ?? turf.Price ?? "",
      image: turf.image ?? turf.Image ?? "",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedTurf(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!selectedTurf) return;
    try {
      const id = selectedTurf.id ?? selectedTurf.Id;
      const payloadLower = {
        id,
        ...editForm,
        price: editForm.price === "" ? "" : Number(editForm.price),
      };
      const payload = {
        ...payloadLower,
        Id: id,
        Name: payloadLower.name,
        Address: payloadLower.address,
        Price: payloadLower.price,
      };
      await axios.put(`http://localhost:8787/turfs/${id}`, payload);
      closeEditModal();
      fetchTurfs();
      showToast("Turf updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update turf. Please try again.", "danger");
    }
  };

  // Delete confirm handlers
  const openDeleteConfirm = (turf) => {
    setSelectedTurf(turf);
    setIsDeleteOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setSelectedTurf(null);
  };

  const confirmDelete = async () => {
    if (!selectedTurf) return;
    try {
      const id = selectedTurf.id ?? selectedTurf.Id;
      await axios.delete(`http://localhost:8787/turfs/${id}`);
      closeDeleteConfirm();
      fetchTurfs();
      showToast("Turf deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete turf. Please try again.", "danger");
    }
  };

  const fetchTurfs = async () => {
    try {
      const response = await axios.get("http://localhost:8787/turfs");
      setTurfs(response.data);
      setShowAllTurfs(true);
      setShowForm(false);
      setShowFeedback(false);
      setShowBooking(false);
    } catch (error) {
      alert("Error fetching turfs.");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:8787/contacts");
      setFeedbacks(response.data);
      setShowFeedback(true);
      setShowAllTurfs(false);
      setShowForm(false);
      setShowBooking(false);
    } catch (error) {
      alert("Error fetching feedback.");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8787/slotbookings/all");
      setBookings(response.data);
      setShowBooking(true);
      setShowAllTurfs(false);
      setShowForm(false);
      setShowFeedback(false);
    } catch (error) {
      alert("Error fetching bookings.");
    }
  };

  const handleLogout = () => {
    // Clear possible admin token if used for dashboard
    try { localStorage.removeItem("token"); } catch (e) {}
    navigate("/login", {
      state: {
        toast: { message: "Admin Logged out successfully!", type: "success", position: "top" },
      },
      replace: true,
    });
  };

  const resetDashboard = () => {
    setShowForm(false);
    setShowAllTurfs(false);
    setShowFeedback(false);
    setShowBooking(false);
  };

  // Booking edit handlers
  // Booking edit disabled (actions column removed)

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditBooking = async (e) => {
    e.preventDefault();
    if (!editBooking) return;
    try {
      // Convert time to ISO format (yyyy-MM-ddTHH:mm:ss)
      let isoTime = editBookingForm.time;
      if (isoTime && !isoTime.includes('T')) {
        // If time is not in ISO format, convert
        const dateObj = new Date(isoTime);
        isoTime = dateObj.toISOString().slice(0, 19);
      }
      await axios.put(`http://localhost:8787/slotbookings/${editBooking.id}`, {
        ...editBooking,
        name: editBookingForm.name,
        turf: editBookingForm.turf,
        time: isoTime,
      });
      setEditBooking(null);
      fetchBookings();
      showToast("Booking updated successfully!", "success");
    } catch (error) {
      alert('Error updating booking. ' + (error.response?.data?.message || error.message));
    }
  };

  

  return (
    <div className="container-fluid">
      {/* Topbar */}
      <div className="row bg-dark text-white py-2 px-0 align-items-center admin-topbar">
        <div className="col">
          <h2
            className="mb-0 admin-title"
            style={{ cursor: "pointer" }}
            onClick={resetDashboard}
          >
            TurfEase
          </h2>
        </div>
        <div className="col text-end">
          <button onClick={ handleLogout } className="btn btn-danger btn-sm admin-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside className="col-md-3 col-lg-2 bg-dark text-white p-4 d-none d-md-block">
          <nav className="nav flex-column">
            <button
              className="nav-link text-white bg-transparent border-0 text-start"
              onClick={() => {
                setShowForm(true);
                setShowAllTurfs(false);
                setShowFeedback(false);
                setShowBooking(false);
              }}
            >
              Turf Details
            </button>
            <button
              className="nav-link text-white bg-transparent border-0 text-start"
              onClick={fetchFeedbacks}
            >
              Feedback History
            </button>
            <button
              className="nav-link text-white bg-transparent border-0 text-start"
              onClick={fetchBookings}
            >
              Booking History
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4 bg-light">
          <h1 className="mb-4">Welcome Admin</h1>

          {/* Dashboard Cards */}
          {!showForm && !showAllTurfs && !showFeedback && !showBooking && (
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-lg-4">
                <div className="card text-dark bg-warning h-100">
                  <div className="card-body">
                    <h5 className="card-title">Turf Details</h5>
                    <ul className="list-unstyled">
                      <li>
                        <button
                          onClick={() => {
                            setShowForm(true);
                            setShowAllTurfs(false);
                          }}
                          className="btn btn-link text-dark p-0 text-decoration-none"
                        >
                          ➕ Add Turf
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={fetchTurfs}
                          className="btn btn-link text-dark p-0 text-decoration-none"
                        >
                          📋 All Turfs
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4" onClick={fetchFeedbacks}>
                <div className="card text-white bg-primary h-100">
                  <div className="card-body">
                    <h5 className="card-title">Feedback History</h5>
                    <p className="card-text">View user feedback and ratings.</p>
                  </div>
                </div>
              </div>

              <div
                className="col-md-6 col-lg-4"
                onClick={() => {
                  fetchBookings();
                }}
              >
                <div className="card text-white bg-success h-100">
                  <div className="card-body">
                    <h5 className="card-title">Booking History</h5>
                    <p className="card-text">Check all booking records.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Turf Form */}
          {showForm && (
            <div className="card shadow p-4 bg-white mb-4">
              <button
                className="btn btn-sm btn-secondary rounded-pill mb-3 bg-primary"
                style={{
                  float: "left",
                  maxWidth: "80px",
                  paddingLeft: "5px",
                  paddingRight: "10px",
                }}
                onClick={resetDashboard}
              >
                ← Back
              </button>

              <h3 className="mb-3">Add New Turf</h3>
              {submitMessage.text && (
                <div className={`alert alert-${submitMessage.type} py-2`}>
                  {submitMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Turf Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Greenfield Arena"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City/Area"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price (₹) / hour</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="999"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-success">
                      {isSubmitting ? "Submitting..." : "Submit Turf"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* All Turfs Table */}
          {showAllTurfs && (
            <div className="card shadow p-4 bg-white">
              <button
                className="btn btn-sm btn-secondary rounded-pill mb-3 bg-primary"
                style={{
                  float: "left",
                  maxWidth: "80px",
                  paddingLeft: "5px",
                  paddingRight: "10px",
                }}
                onClick={resetDashboard}
              >
                ← Back
              </button>
              <h3 className="mb-4">All Turfs</h3>

              {/* Mobile card layout */}
              <div className="d-md-none">
                <div className="row g-3">
                  {turfs.map((turf) => (
                    <div className="col-12" key={turf.id}>
                      <div className="card turf-card-mobile h-100">
                        <div className="row g-0 align-items-center">
                          <div className="col-4">
                            <img
                              src={turf.image}
                              alt={turf.name}
                              className="img-fluid rounded-start"
                              style={{ height: 80, width: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="col-8">
                            <div className="card-body py-2">
                              <h6 className="card-title mb-1 text-truncate" title={turf.name}>{turf.name}</h6>
                              <div className="small text-muted mb-1 text-truncate" title={turf.location || turf.address}>
                                {turf.location || turf.address}
                              </div>
                              <div className="fw-semibold">₹ {turf.price}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/tablet table */}
              <div className="table-responsive d-none d-md-block">
                <table
                  className="table table-bordered table-striped all-turfs-table"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <colgroup>
                    <col style={{ width: "3%" }} /> {/* ID */}
                    <col style={{ width: "20%" }} /> {/* Name */}
                    <col style={{ width: "21%" }} /> {/* Address (hidden on < md) */}
                    <col style={{ width: "9%" }} /> {/* Location (hidden on < lg) */}
                    <col style={{ width: "6%" }} /> {/* Price */}
                    <col style={{ width: "10%" }} /> {/* Image (hidden on < lg) */}
                    <col style={{ width: "10%" }} /> {/* Actions (hidden on < md) */}
                  </colgroup>
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th className="d-none d-md-table-cell">Address</th>
                      <th className="d-none d-lg-table-cell">Location</th>
                      <th>Price</th>
                      <th className="d-none d-lg-table-cell">Image</th>
                      <th className="d-none d-md-table-cell text-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turfs.map((turf) => (
                      <tr key={turf.id}>
                        <td>{turf.id}</td>
                        <td>{turf.name}</td>
                        <td className="d-none d-md-table-cell">{turf.address}</td>
                        <td className="d-none d-lg-table-cell">{turf.location}</td>
                        <td>{turf.price}</td>
                        <td className="d-none d-lg-table-cell">
                          <img
                            src={turf.image}
                            alt="Turf"
                            className="img-fluid"
                            style={{ maxHeight: "60px", objectFit: "cover" }}
                          />
                        </td>
                        <td className="d-none d-md-table-cell text-nowrap">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => openEditModal(turf)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openDeleteConfirm(turf)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback History */}
          {showFeedback && (
            <div className="card shadow p-4 bg-white">
              <button
                className="btn btn-sm btn-secondary rounded-pill mb-3 bg-primary"
                style={{
                  float: "left",
                  maxWidth: "80px",
                  paddingLeft: "5px",
                  paddingRight: "10px",
                }}
                onClick={resetDashboard}
              >
                ← Back
              </button>
              <h3 className="mb-4">User Feedback History</h3>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-primary">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((fb) => (
                      <tr key={fb.id}>
                        <td>{fb.id}</td>
                        <td>{fb.fullname}</td>
                        <td>{fb.email}</td>
                        <td>{fb.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Booking History */}
          {showBooking && (
            <div className="card shadow p-4 bg-white">
              <button
                className="btn btn-sm btn-secondary rounded-pill mb-3 bg-primary"
                style={{
                  float: "left",
                  maxWidth: "80px",
                  paddingLeft: "5px",
                  paddingRight: "10px",
                }}
                onClick={resetDashboard}
              >
                ← Back
              </button>
              <h3 className="mb-4">Booking History</h3>

              {/* Mobile card layout for bookings */}
              <div className="d-md-none">
                {bookings.length === 0 ? (
                  <div className="text-center text-muted py-2">No data available</div>
                ) : (
                  <div className="list-group">
                    {bookings.map((booking) => {
                      const dateObj = new Date(booking.time);
                      const dateStr = dateObj.toLocaleDateString();
                      const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      return (
                        <div key={booking.id} className="list-group-item booking-card-mobile">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="me-2">
                              <div className="fw-semibold">{booking.turf}</div>
                              <div className="small text-muted">{booking.name}</div>
                            </div>
                            <div className="text-end">
                              <div className="badge bg-success">{dateStr}</div>
                              <div className="small">{timeStr}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Desktop/table view */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-striped">
                  <thead className="table-success">
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Turf</th>
                      <th>Date</th>
                      <th>Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => {
                        const dateObj = new Date(booking.time);
                        const dateStr = dateObj.toLocaleDateString();
                        const timeStr = dateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.name}</td>
                            <td>{booking.turf}</td>
                            <td>{dateStr}</td>
                            <td>{timeStr}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "90%", maxWidth: 500 }}
          >
            <h4 className="mb-3">Edit Turf</h4>
            <form onSubmit={submitEdit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {isDeleteOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "90%", maxWidth: 420 }}
          >
            <h5 className="mb-3">Delete Turf</h5>
            <p className="mb-4">
              Are you sure you want to delete this turf
              {selectedTurf ? ` (ID: ${selectedTurf.id})` : ""}? This action
              cannot be undone.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={closeDeleteConfirm}
              >
                No
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Edit Modal */}
      {editBooking && (
        <div
          className="modal show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={submitEditBooking}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Booking</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditBooking(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editBookingForm.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Turf</label>
                    <input
                      type="text"
                      className="form-control"
                      name="turf"
                      value={editBookingForm.turf}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="time"
                      value={editBookingForm.time}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditBooking(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (top-center or center) */}
      {toast.show &&
        (() => {
          const containerStyle =
            toast.position === "center"
              ? {
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2000,
                }
              : {
                  position: "fixed",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2000,
                };
          return (
            <div style={containerStyle}>
              <div
                className={`alert alert-${toast.type} shadow mb-0`}
                role="alert"
              >
                {toast.message}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
