import { useEffect, useState } from "react";
import SOSButton from "../components/SOSButton";
import MapView from "../components/MapView";
import ProfileForm from "../components/ProfileForm";
import SafeZones from "../components/SafeZones";
import AlertCard from "../components/AlertCard";
import EmergencyContacts from "../components/EmergencyContacts";
import api from "../services/api";

function Dashboard() {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = () => {
    api
      .get("/alerts")
      .then(({ data }) => setAlerts(data))
      .catch(() => setAlerts([]));
  };

  useEffect(loadAlerts, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Safety dashboard</h1>
          <p>
            Send a location-based SOS, check the latest safety status, and keep
            emergency response within reach.
          </p>
        </div>
      </div>

      <div className="sos-panel">
        <div>
          <h2>Emergency assistance</h2>
          <p className="muted">
            Press SOS only during an active emergency. Your current location is
            shared with admins and available volunteers.
          </p>
        </div>
        <SOSButton onCreated={loadAlerts} />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Live safety map</h3>
          <MapView />
        </div>
        <SafeZones />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <ProfileForm />
        <div className="card">
          <h3>Emergency alert history</h3>
          <div className="stack">
            {alerts.length ? (
              alerts.map((alert) => <AlertCard alert={alert} key={alert._id} />)
            ) : (
              <p className="muted">Your triggered alerts will appear here.</p>
            )}
          </div>
        </div>
      </div>

      <EmergencyContacts />
    </section>
  );
}

export default Dashboard;
