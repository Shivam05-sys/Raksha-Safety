import { useEffect, useState } from "react";
import api from "../services/api";

const emptyContact = { name: "", relation: "", phone: "", priority: 1 };

function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    safetyProfile: {
      age: "",
      bloodGroup: "",
      address: "",
      medicalNotes: "",
      preferredLanguage: ""
    },
    emergencyContacts: [emptyContact]
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/users/me")
      .then(({ data }) =>
        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          safetyProfile: {
            age: data.safetyProfile?.age || "",
            bloodGroup: data.safetyProfile?.bloodGroup || "",
            address: data.safetyProfile?.address || "",
            medicalNotes: data.safetyProfile?.medicalNotes || "",
            preferredLanguage: data.safetyProfile?.preferredLanguage || ""
          },
          emergencyContacts: data.emergencyContacts?.length
            ? data.emergencyContacts
            : [emptyContact]
        })
      )
      .catch(() => setMessage("Login to complete your safety profile."));
  }, []);

  const updateRoot = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const updateSafety = (event) => {
    setProfile({
      ...profile,
      safetyProfile: {
        ...profile.safetyProfile,
        [event.target.name]: event.target.value
      }
    });
  };

  const updateContact = (index, event) => {
    const emergencyContacts = [...profile.emergencyContacts];
    emergencyContacts[index] = {
      ...emergencyContacts[index],
      [event.target.name]: event.target.value
    };
    setProfile({ ...profile, emergencyContacts });
  };

  const addContact = () => {
    setProfile({
      ...profile,
      emergencyContacts: [...profile.emergencyContacts, emptyContact]
    });
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      await api.put("/users/me", profile);
      setMessage("Safety profile saved.");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Could not save profile.");
    }
  };

  return (
    <form className="card form" onSubmit={save}>
      <h3>Personal safety profile</h3>
      <label>
        Full name
        <input name="name" value={profile.name} onChange={updateRoot} />
      </label>
      <label>
        Phone
        <input name="phone" value={profile.phone} onChange={updateRoot} />
      </label>
      <div className="form-grid">
        <label>
          Age
          <input name="age" value={profile.safetyProfile.age} onChange={updateSafety} />
        </label>
        <label>
          Blood group
          <input
            name="bloodGroup"
            value={profile.safetyProfile.bloodGroup}
            onChange={updateSafety}
          />
        </label>
      </div>
      <label>
        Address
        <input
          name="address"
          value={profile.safetyProfile.address}
          onChange={updateSafety}
        />
      </label>
      <label>
        Medical notes
        <input
          name="medicalNotes"
          value={profile.safetyProfile.medicalNotes}
          onChange={updateSafety}
        />
      </label>
      <label>
        Preferred language
        <input
          name="preferredLanguage"
          value={profile.safetyProfile.preferredLanguage}
          onChange={updateSafety}
        />
      </label>

      <h3>Emergency contacts</h3>
      {profile.emergencyContacts.map((contact, index) => (
        <div className="contact-row" key={index}>
          <input
            name="name"
            placeholder="Name"
            value={contact.name}
            onChange={(event) => updateContact(index, event)}
          />
          <input
            name="relation"
            placeholder="Relation"
            value={contact.relation}
            onChange={(event) => updateContact(index, event)}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={contact.phone}
            onChange={(event) => updateContact(index, event)}
          />
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={addContact}>
        Add contact
      </button>
      <button className="primary-button" type="submit">
        Save profile
      </button>
      {message && (
        <p className={`message ${message.includes("saved") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export default ProfileForm;
