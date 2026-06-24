import { useEffect, useState } from "react";
import api from "../services/api";

function SafeZones({ editable = false }) {
  const [safeZones, setSafeZones] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "public",
    phone: ""
  });
  const [message, setMessage] = useState("");

  const load = () => {
    api
      .get("/safe-zones")
      .then(({ data }) => setSafeZones(data))
      .catch(() => setMessage("Login to view safe zones."));
  };

  useEffect(load, []);

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post("/safe-zones", form);
      setForm({ name: "", address: "", type: "public", phone: "" });
      setMessage("Safe zone added.");
      load();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Could not add safe zone.");
    }
  };

  return (
    <div className="card">
      <h3>Nearby support and safe zones</h3>
      {editable && (
        <form className="form compact-form" onSubmit={create}>
          <input name="name" placeholder="Name" value={form.name} onChange={update} required />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={update}
            required
          />
          <select name="type" value={form.type} onChange={update}>
            <option value="public">Public safe place</option>
            <option value="police">Police station</option>
            <option value="hospital">Hospital</option>
            <option value="shelter">Shelter</option>
          </select>
          <input name="phone" placeholder="Phone" value={form.phone} onChange={update} />
          <button className="primary-button" type="submit">
            Add safe zone
          </button>
        </form>
      )}
      {message && (
        <p className={`message ${message.includes("added") ? "success" : "error"}`}>
          {message}
        </p>
      )}
      <div className="resource-list">
        {safeZones.length ? (
          safeZones.map((zone) => (
            <article className="resource-item" key={zone._id}>
              <strong>{zone.name}</strong>
              <span className="muted">{zone.type}</span>
              <span>{zone.address}</span>
              {zone.phone && <span>{zone.phone}</span>}
            </article>
          ))
        ) : (
          <p className="muted">No safe zones added yet.</p>
        )}
      </div>
    </div>
  );
}

export default SafeZones;
