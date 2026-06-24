import { useState } from "react";
import api from "../services/api";

function SOSButton({ onCreated }) {
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSOS = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not available in this browser.");
      return;
    }

    setIsSending(true);
    setStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await api.post("/alerts/sos", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setStatus("Emergency alert sent. Help has been notified.");
          onCreated?.(data);
        } catch (error) {
          setStatus(error.response?.data?.msg || "Could not send alert.");
        } finally {
          setIsSending(false);
        }
      },
      () => {
        setStatus("Location permission is required to send an SOS.");
        setIsSending(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  return (
    <div>
      <button
        className="sos-button"
        disabled={isSending}
        type="button"
        onClick={handleSOS}
      >
        SOS
      </button>
      {status && (
        <p className={`message ${status.includes("sent") ? "success" : "error"}`}>
          {status}
        </p>
      )}
    </div>
  );
}

export default SOSButton;
