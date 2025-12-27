import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Local toast (match Dashboard)
  const [toast, setToast] = useState({ show: false, type: "success", message: "", position: "top" });
  const toastRef = useRef(null);
  const showToast = (message, type = "success", position = "top") => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast({ show: true, type, message, position });
    toastRef.current = setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  // Show toast on arrival from login
  useEffect(() => {
    if (location.state?.toast) {
      const { message, type = "success", position = "top" } = location.state.toast;
      showToast(message, type, position);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  const userToken = localStorage.getItem("userToken");
  
  

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }

    const fetchProfileAndBookings = async () => {
      try {
        const currentUserEmail = localStorage.getItem("userEmail");
        
        if (!currentUserEmail) {
          setLoading(false);
          return;
        }
        
        const response = await fetch("http://localhost:5002/api/User", {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });
        const allUsers = await response.json();
        
        const currentUser = allUsers.find(user =>
          user.userEmail === currentUserEmail ||
          user.email === currentUserEmail ||
          user.userEmail?.toLowerCase?.() === currentUserEmail?.toLowerCase?.() ||
          user.email?.toLowerCase?.() === currentUserEmail?.toLowerCase?.()
        );
        
        if (currentUser) {
          setProfile(currentUser);
        } else {
          const fallbackProfile = {
            fullName: localStorage.getItem("userFullName") || localStorage.getItem("name") || null,
            userEmail: currentUserEmail || localStorage.getItem("userEmail") || localStorage.getItem("email") || null,
            phoneNumber: localStorage.getItem("userPhone") || localStorage.getItem("phone") || null,
            id: null,
          };
          setProfile(fallbackProfile);
        }

        setBookings([]);
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProfileAndBookings();
  }, [userToken, navigate]);

  useEffect(() => {
    if (!profile.userEmail && !profile.email) return;
    const fetchBookingsByEmail = async () => {
      const searchEmail = profile.userEmail || profile.email;
      try {
        const response = await fetch(
          `http://localhost:8787/slotbookings/search?email=${encodeURIComponent(searchEmail)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bookings. Status: " + response.status);
        }
        const bookingsData = await response.json();
        setBookings(bookingsData);
      } catch (error) {
        // Silent fail
      }
    };
    fetchBookingsByEmail();
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    navigate("/login", {
      state: {
        toast: { message: "Logout successful!", type: "success", position: "top" },
      },
      replace: true,
    });
  };

  // const handleRefreshProfile = async () => {
  //   setLoading(true);
  //   try {
  //     // Get current user's email from localStorage
  //     const currentUserEmail = localStorage.getItem("userEmail");
  //     console.log("Refreshing profile for user:", currentUserEmail);
      
  //     if (!currentUserEmail) {
  //       console.log("No user email found in localStorage");
  //       setLoading(false);
  //       return;
  //     }
      
  //     // Fetch all users from the database
  //     const response = await fetch("http://localhost:5002/api/User");
  //     const allUsers = await response.json();
  //     console.log("All users from database:", allUsers);
      
  //     // Search for the current user by email
  //     const currentUser = allUsers.find(user => user.userEmail === currentUserEmail);
      
  //     if (currentUser) {
  //       console.log("Found user in database:", currentUser);
  //       setProfile(currentUser);
  //     } else {
  //       console.log("User not found in database");
  //       setProfile({});
  //     }
  //   } catch (error) {
  //     console.error("Failed to refresh profile", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) return <div className="text-center mt-5" style={{ marginTop: "80px" }}>Loading...</div>;

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
        <h1 style={{ margin: 0 }}>Profile</h1>
      </div>

    <div className="container" style={{ maxWidth: "800px", marginTop: "40px" }}>
      <div className="d-flex align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">
          Welcome, {profile.fullName || profile.name || "User"}
        </h2>
        <button className="btn btn-danger btn-sm ms-auto" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Profile Info Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">User Information</h5>
        </div>
        <div className="card-body">
          <p>
            <strong>Full Name:</strong> {profile.fullName || profile.name || "Not available"}
          </p>
          <p>
            <strong>Email:</strong> {profile.userEmail || profile.email || "Not available"}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phoneNumber || profile.phone || "Not available"}
          </p>
          <p>
            <strong>User ID:</strong> {profile.id || profile.userId || "Not available"}
          </p>
          

          
          {(!profile.fullName && !profile.name) && (
            <div className="alert alert-warning mt-3">
              <small>Note: Some profile information may not be available. Please contact support if this persists.</small>
            </div>
          )}
        </div>
      </div>

      {/* Booking History Section */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Booking History</h5>
        </div>
        <div className="card-body">
          {bookings.length === 0 ? (
            <p className="text-muted">No bookings found.</p>
          ) : (
            <div className="list-group">
              {bookings.map((booking, idx) => (
                <div
                  key={idx}
                  className="list-group-item list-group-item-action mb-2 border rounded shadow-sm"
                >
                  <p className="mb-1">
                    <strong>Name:</strong> {booking.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {booking.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone Number:</strong> {booking.phoneNumber}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {new Date(booking.time).toLocaleString()}
                  </p>
                  <p className="mb-1">
                    <strong>Turf:</strong> {booking.turf}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

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
