import SOSButton from "../components/SOSButton";

function SOS() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>SOS</h1>
          <p>Share your live location with the response team immediately.</p>
        </div>
      </div>
      <div className="sos-panel">
        <div>
          <h2>Send emergency alert</h2>
          <p className="muted">
            The app will request location permission, then submit your
            coordinates to the backend.
          </p>
        </div>
        <SOSButton />
      </div>
    </section>
  );
}

export default SOS;
