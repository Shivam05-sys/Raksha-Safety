import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Unable to log in.");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Login</h1>
          <p>Access your safety dashboard and response tools.</p>
        </div>
      </div>
      <form className="card form" onSubmit={submit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        <button className="primary-button" type="submit">
          Login
        </button>
        {message && <p className="message error">{message}</p>}
        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
