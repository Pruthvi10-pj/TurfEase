import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./Login.css";

export default function Login() {
  const [userFullName, setUserFullName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Missing state declarations:
  const [isAdmin, setIsAdmin] = useState(false); // Admin/user toggle state
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between registration and login
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const [adminUsername, setAdminUsername] = useState(""); // Admin login username
  const [adminPassword, setAdminPassword] = useState(""); // Admin login password

  const navigate = useNavigate();
  const location = useLocation();

  // Local toast state (matching Dashboard style)
  const [toast, setToast] = useState({ show: false, type: "success", message: "", position: "top" });
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

  // Show toast if redirected with state (e.g., logout success)
  useEffect(() => {
    if (location.state?.toast) {
      const { message, type = "success", position = "top" } = location.state.toast;
      showToast(message, type, position);
      // Replace state so it won't re-show on back/forward
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  const handleToggleRole = () => {
    setIsAdmin((prev) => !prev);
    setIsRegistering(false);
    setErrorMessage("");
  };

  const handleRegisterToggle = () => {
    setIsRegistering((prev) => !prev);
    setErrorMessage("");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5002/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword,
        }),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        localStorage.setItem("token", result.token);
        setSubmitMessage({ type: "success", text: "Admin Logged in successfully!" });
        navigate("/dashboard", {
          state: {
            toast: { message: "Admin Login successful!", type: "success", position: "top" },
          },
          replace: true,
        });
      } else {
        setErrorMessage(result.message || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5002/api/User/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: userFullName,
          phoneNumber: userPhone,
          userEmail: userEmail,
          password: userPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data in localStorage for profile display
        localStorage.setItem("userFullName", userFullName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userPhone", userPhone);
        showToast("Registration successful! Please login.", "success", "top");
        setIsRegistering(false); // Toggle to login after successful registration
      } else {
        setErrorMessage(result.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5002/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          password: userPassword,
        }),
      });

      const result = await response.json();
      console.log("Login API response:", result);

      if (response.ok) {
        if (result.token) localStorage.setItem("userToken", result.token);
        if (result.userToken)
          localStorage.setItem("userToken", result.userToken);

        const storedFullName =
          result.fullName || result.name || userFullName || "";
        const storedEmail = result.userEmail || result.email || userEmail || "";
        const storedPhone =
          result.phoneNumber || result.phone || userPhone || "";

        if (storedFullName)
          localStorage.setItem("userFullName", storedFullName);
        if (storedEmail) localStorage.setItem("userEmail", storedEmail);
        if (storedPhone) localStorage.setItem("userPhone", storedPhone);

        setSubmitMessage({ type: "success", text: "Login successful! Welcome." });
        navigate("/profile", {
          state: {
            toast: { message: "Login successful!", type: "success", position: "top" },
          },
          replace: true,
        });
      } else {
        setErrorMessage(result.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Note: Logout is handled from Profile/Dashboard and routed back here with a toast state

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
        <h1 style={{ margin: 0 }}>Login / Register</h1>
      </div>

      <div className="container d-flex justify-content-center align-items-center py-5">
        <div
          className="card shadow-lg w-100"
          style={{
            maxWidth: "450px",
            border: "1px solid #cfcfcf",
            borderRadius: "12px",
            background: "#f9f9f9",
          }}
        >
          <div className="card-body px-4 py-4">
            {submitMessage.text && (
              <div className={`alert alert-${submitMessage.type} py-2 text-center`}>
                {submitMessage.text}
              </div>
            )}
            <h4
              className="text-center mb-3"
              style={{ color: "blue", fontWeight: "600" }}
            >
              {isAdmin
                ? "Admin Login"
                : isRegistering
                ? "User Registration"
                : "User Login"}
            </h4>

            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <span style={{ fontWeight: "500" }}>
                  {isAdmin ? "Switch to User" : "Switch to Admin"}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={handleToggleRole}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <form
              onSubmit={
                isAdmin
                  ? handleAdminLogin
                  : isRegistering
                  ? handleUserRegister
                  : handleUserLogin
              }
            >
              {/* User Registration Fields */}
              {!isAdmin && isRegistering && (
                <>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      placeholder="Enter full name"
                      required
                      value={userFullName}
                      onChange={(e) => setUserFullName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                      required
                      value={userPhone}
                      maxLength="10"
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Email and Password Fields */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  {isAdmin ? "Username" : "User Email"}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type={isAdmin ? "text" : "email"}
                  className="form-control"
                  id="email"
                  placeholder={isAdmin ? "Enter username" : "Enter your email"}
                  required
                  value={isAdmin ? adminUsername : userEmail}
                  onChange={(e) =>
                    isAdmin
                      ? setAdminUsername(e.target.value)
                      : setUserEmail(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {isAdmin ? "Admin Password" : "Password"}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  required
                  value={isAdmin ? adminPassword : userPassword}
                  onChange={(e) =>
                    isAdmin
                      ? setAdminPassword(e.target.value)
                      : setUserPassword(e.target.value)
                  }
                />
              </div>

              {errorMessage && (
                <div className="mb-3 text-danger text-center">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{
                  backgroundColor: "#ffc107",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {isAdmin
                  ? "Login as Admin"
                  : isRegistering
                  ? "Register"
                  : "Login as User"}
              </button>
            </form>

            {!isAdmin && (
              <div className="text-center">
                <button
                  className="btn btn-link text-decoration-none"
                  onClick={handleRegisterToggle}
                  style={{ fontSize: "14px", color: "green" }}
                >
                  {isRegistering
                    ? "Already have an account? Login"
                    : "New user? Register here"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Local Toast (top or center) */}
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
