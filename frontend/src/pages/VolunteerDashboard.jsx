import { useEffect, useState } from "react";
import AlertCard from "../components/AlertCard";
import api from "../services/api";

function VolunteerDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [available, setAvailable] = useState(true);

  const load = () => {
    api
      .get("/alerts")
      .then(({ data }) => setAlerts(data.filter((alert) => alert.status === "pending")))
      .catch(() => setAlerts([]));
  };

  useEffect(load, []);

  const toggleAvailability = async () => {
    const next = !available;
    setAvailable(next);
    await api.post("/volunteers/me", { available: next });
  };

  const acceptAlert = async (alert) => {
    await api.post(`/alerts/${alert._id}/accept`);
    load();
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Volunteer dashboard</h1>
          <p>Keep availability visible and review nearby pending alerts.</p>
        </div>
        <button
          className={available ? "primary-button" : "ghost-button"}
          type="button"
          onClick={toggleAvailability}
        >
          {available ? "Available" : "Unavailable"}
        </button>
      </div>
      <div className="grid">
        {alerts.length ? (
          alerts.map((alert) => (
            <AlertCard alert={alert} key={alert._id} onAccept={acceptAlert} />
          ))
        ) : (
          <div className="card">
            <h3>No pending alerts</h3>
            <p className="muted">Pending alerts will show up here when available.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VolunteerDashboard;
