import { useEffect, useState } from "react";
import AlertCard from "../components/AlertCard";
import SafeZones from "../components/SafeZones";
import api from "../services/api";

function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => {
    Promise.all([
      api.get("/alerts"),
      api.get("/users"),
      api.get("/volunteers"),
      api.get("/alerts/reports/summary")
    ])
      .then(([alertsRes, usersRes, volunteersRes, reportRes]) => {
        setAlerts(alertsRes.data);
        setUsers(usersRes.data);
        setVolunteers(volunteersRes.data);
        setReport(reportRes.data);
      })
      .catch(() => setMessage("Login to view admin coordination data."));
  };

  useEffect(load, []);

  const updateStatus = async (alert, status) => {
    await api.patch(`/alerts/${alert._id}/status`, { status });
    load();
  };

  const verifyVolunteer = async (volunteer) => {
    await api.patch(`/volunteers/${volunteer._id}/verify`);
    load();
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Admin dashboard</h1>
          <p>Monitor incoming SOS alerts and response status.</p>
        </div>
      </div>
      {message && <p className="message error">{message}</p>}
      {report && (
        <div className="metrics-grid">
          <div className="metric">
            <strong>{report.totalAlerts}</strong>
            <span>Total alerts</span>
          </div>
          <div className="metric">
            <strong>{report.pendingAlerts}</strong>
            <span>Pending</span>
          </div>
          <div className="metric">
            <strong>{report.successfulAssistanceRate}%</strong>
            <span>Success rate</span>
          </div>
          <div className="metric">
            <strong>{report.volunteerResponseRate}%</strong>
            <span>Volunteer response</span>
          </div>
        </div>
      )}
      <div className="grid">
        {alerts.length ? (
          alerts.map((alert) => (
            <AlertCard alert={alert} key={alert._id} onStatus={updateStatus} />
          ))
        ) : (
          <div className="card">
            <h3>No active alerts</h3>
            <p className="muted">New SOS requests will appear here.</p>
          </div>
        )}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Users</h3>
          <div className="resource-list">
            {users.map((user) => (
              <article className="resource-item" key={user._id}>
                <strong>{user.name}</strong>
                <span className="muted">{user.role}</span>
                <span>{user.email}</span>
                {user.phone && <span>{user.phone}</span>}
              </article>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Volunteers</h3>
          <div className="resource-list">
            {volunteers.map((volunteer) => (
              <article className="resource-item" key={volunteer._id}>
                <strong>{volunteer.userId?.name || "Volunteer"}</strong>
                <span className="muted">{volunteer.verificationStatus}</span>
                <span>{volunteer.available ? "Available" : "Unavailable"}</span>
                {volunteer.verificationStatus !== "verified" && (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => verifyVolunteer(volunteer)}
                  >
                    Verify
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
        <SafeZones editable />
      </div>
    </section>
  );
}

export default AdminDashboard;
