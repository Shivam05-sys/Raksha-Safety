import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const defaultPosition = [28.6139, 77.209];

const liveIcon = new L.DivIcon({
  className: "live-location-marker",
  html: "<span></span>",
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15, { animate: true });
    }
  }, [map, position]);

  return null;
}

function MapView() {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [message, setMessage] = useState("Allow location access to show your live position.");

  const center = useMemo(() => position || defaultPosition, [position]);

  const locate = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not available in this browser.");
      return;
    }

    setMessage("Getting your live location...");
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setPosition([result.coords.latitude, result.coords.longitude]);
        setAccuracy(result.coords.accuracy);
        setMessage("Live location active.");
      },
      () => {
        setMessage("Location permission was denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    locate();

    if (!navigator.geolocation) {
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (result) => {
        setPosition([result.coords.latitude, result.coords.longitude]);
        setAccuracy(result.coords.accuracy);
        setMessage("Live location active.");
      },
      () => {
        setMessage("Location permission was denied or unavailable.");
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="map-panel">
      <div className="map-box" aria-label="Live safety map">
        <MapContainer center={center} zoom={position ? 15 : 12} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap position={position} />
          {position && (
            <>
              <Marker icon={liveIcon} position={position}>
                <Popup>Your live location</Popup>
              </Marker>
              {accuracy && (
                <Circle
                  center={position}
                  pathOptions={{ color: "#0f5f52", fillColor: "#0f5f52" }}
                  radius={accuracy}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>
      <div className="map-actions">
        <span className={message.includes("active") ? "map-status active" : "map-status"}>
          {message}
        </span>
        <button className="ghost-button" type="button" onClick={locate}>
          Recenter
        </button>
      </div>
    </div>
  );
}

export default MapView;
