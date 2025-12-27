import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Event() {
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const navigate = useNavigate();

  const locations = ["All" , "Andheri", "Bandra" , "Borivali" , "Dadar" , "Goregaon", "Thane"];

  useEffect(() => {
    fetchAllTurfs();
  }, []);

  const fetchAllTurfs = async () => {
    try {
      const response = await axios.get("http://localhost:8787/turfs");
      setTurfs(response.data);
      const sortedTurfs = [...response.data].sort((a, b) =>
        a.location.localeCompare(b.location)
      );
      setFilteredTurfs(sortedTurfs);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    }
  };

  const handleFilter = async (location) => {
  setSelectedLocation(location);

  if (location === "All") {
    const sortedTurfs = [...turfs].sort((a, b) => {
      const locA = a?.location ?? "";
      const locB = b?.location ?? "";
      return locA.localeCompare(locB);
    });
    setFilteredTurfs(sortedTurfs);
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8787/turfs/${location}`);
    setFilteredTurfs(response.data);
  } catch (error) {
    console.error("Error filtering turfs:", error);
  }
};


  const handleTurfClick = (turf) => {
    navigate("/payment", { state: { turf } });
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
        <h1 style={{ margin: 0 }}>Book Event</h1>
      </div>

      <div className="container py-5">
        {/* Location Filter Buttons */}
        <div className="mb-4 d-flex flex-wrap justify-content-center">
          {locations.map((location, idx) => (
            <button
              key={idx}
              className={`btn m-2 px-4 py-2 fw-semibold shadow ${
                selectedLocation === location ? "btn-danger" : "btn-warning"
              }`}
              onClick={() => handleFilter(location)}
              style={{
                borderRadius: "25px",
                transition: "all 0.3s ease",
                minWidth: "100px",
              }}
            >
              {location}
            </button>
          ))}
        </div>

        {/* Turf Cards */}
        <div className="row g-4">
          {filteredTurfs.length > 0 ? (
            filteredTurfs.map((turf, idx) => (
              <div className="col-12 col-sm-6 col-md-4" key={idx}>
                <div
                  className="card h-100 shadow-sm border-0 rounded-4 cursor-pointer"
                  onClick={() => handleTurfClick(turf)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={turf.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    className="card-img-top rounded-top-4"
                    alt={turf.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-success mb-2">{turf.name}</h5>
                    <p className="card-text text-muted flex-grow-1"></p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-between">
                    <span className="badge bg-primary px-3 py-2 rounded-pill">
                      📍 {turf.location || "Unknown"}
                    </span>
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                      ₹ {turf.price ? turf.price : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No turfs available for this location.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}