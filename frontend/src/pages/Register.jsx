import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Unable to register.");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Create account</h1>
          <p>Register as a user, volunteer, or admin for local testing.</p>
        </div>
      </div>
      <form className="card form" onSubmit={submit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Password
          <input
            name="password"
            minLength="6"
            type="password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={update}>
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="primary-button" type="submit">
          Register
        </button>
        {message && <p className="message error">{message}</p>}
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
