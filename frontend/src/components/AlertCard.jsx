function AlertCard({ alert, onAccept, onStatus }) {
  const created = alert.createdAt
    ? new Date(alert.createdAt).toLocaleString()
    : "Just now";
  const user = alert.userId;
  const assignedUser = alert.assignedVolunteer?.userId;

  return (
    <article className="card alert-card">
      <span className={`status ${alert.status || "pending"}`}>
        {alert.status || "pending"}
      </span>
      <strong>Alert #{String(alert._id || "local").slice(-6)}</strong>
      <span className="muted">{created}</span>
      {user?.name && <span>User: {user.name}</span>}
      <span>
        Location: {alert.location?.lat?.toFixed?.(4) || alert.location?.lat},{" "}
        {alert.location?.lng?.toFixed?.(4) || alert.location?.lng}
      </span>
      {assignedUser?.name && <span>Responder: {assignedUser.name}</span>}
      {user?.emergencyContacts?.length > 0 && (
        <span className="muted">
          Contact: {user.emergencyContacts[0].name} ({user.emergencyContacts[0].phone})
        </span>
      )}
      <div className="button-row">
        {onAccept && alert.status === "pending" && (
          <button className="primary-button" type="button" onClick={() => onAccept(alert)}>
            Accept
          </button>
        )}
        {onStatus && alert.status !== "resolved" && (
          <>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onStatus(alert, "responding")}
            >
              Responding
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onStatus(alert, "resolved")}
            >
              Close
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default AlertCard;
