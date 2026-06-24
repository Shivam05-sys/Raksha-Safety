import { useEffect, useState } from "react";
import api from "../services/api";

const commonContacts = [
  {
    label: "Emergency",
    name: "National Emergency Response",
    phone: "112",
    detail: "Police, fire, medical, women and child safety"
  },
  {
    label: "Police",
    name: "Police Control Room",
    phone: "100",
    detail: "Crime, threat, unsafe situation"
  },
  {
    label: "Fire",
    name: "Fire & Rescue",
    phone: "101",
    detail: "Fire, rescue, hazard"
  },
  {
    label: "Ambulance",
    name: "Medical Ambulance",
    phone: "108",
    detail: "Medical emergency"
  },
  {
    label: "Women",
    name: "Women Helpline",
    phone: "1091",
    detail: "Women in distress"
  }
];

const emptyContact = { name: "", relation: "", phone: "", priority: 1 };

function EmergencyContacts() {
  const [profile, setProfile] = useState(null);
  const [contact, setContact] = useState(emptyContact);
  const [message, setMessage] = useState("");

  const loadProfile = () => {
    api
      .get("/users/me")
      .then(({ data }) => {
        setProfile(data);
        setMessage("");
      })
      .catch(() => {
        setProfile(null);
        setMessage("Login to save family emergency contacts.");
      });
  };

  useEffect(loadProfile, []);

  const update = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const addContact = async (event) => {
    event.preventDefault();

    if (!profile) {
      setMessage("Login to save family emergency contacts.");
      return;
    }

    const emergencyContacts = [...(profile.emergencyContacts || []), contact];

    try {
      const { data } = await api.put("/users/me", {
        name: profile.name,
        phone: profile.phone,
        safetyProfile: profile.safetyProfile,
        emergencyContacts
      });
      setProfile(data);
      setContact(emptyContact);
      setMessage("Family contact saved.");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Could not save contact.");
    }
  };

  const removeContact = async (index) => {
    const emergencyContacts = [...(profile?.emergencyContacts || [])];
    emergencyContacts.splice(index, 1);

    const { data } = await api.put("/users/me", {
      name: profile.name,
      phone: profile.phone,
      safetyProfile: profile.safetyProfile,
      emergencyContacts
    });

    setProfile(data);
  };

  return (
    <section className="contacts-section">
      <div className="section-title">
        <h2>Emergency contacts</h2>
        <p className="muted">Call emergency services or your trusted family contacts directly.</p>
      </div>

      <div className="contact-grid">
        {commonContacts.map((item) => (
          <article className="contact-card official-contact" key={item.phone}>
            <span className="contact-label">{item.label}</span>
            <strong>{item.name}</strong>
            <span className="muted">{item.detail}</span>
            <a className="call-button" href={`tel:${item.phone}`}>
              Call {item.phone}
            </a>
          </article>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form className="card form" onSubmit={addContact}>
          <h3>Add family contact</h3>
          <label>
            Name
            <input name="name" value={contact.name} onChange={update} required />
          </label>
          <label>
            Relation
            <input name="relation" value={contact.relation} onChange={update} required />
          </label>
          <label>
            Phone
            <input name="phone" value={contact.phone} onChange={update} required />
          </label>
          <button className="primary-button" type="submit">
            Save contact
          </button>
          {message && (
            <p className={`message ${message.includes("saved") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="card">
          <h3>Family contacts</h3>
          <div className="resource-list">
            {profile?.emergencyContacts?.length ? (
              profile.emergencyContacts.map((item, index) => (
                <article className="family-contact" key={`${item.phone}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span className="muted">
                      {item.relation} {item.phone && `- ${item.phone}`}
                    </span>
                  </div>
                  <div className="button-row compact-buttons">
                    <a className="call-button" href={`tel:${item.phone}`}>
                      Call
                    </a>
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={() => removeContact(index)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="muted">No family contacts saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyContacts;
