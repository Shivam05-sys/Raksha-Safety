import { NavLink } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="navbar">
      <NavLink className="brand" to="/dashboard">
        Raksha Safety
      </NavLink>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/sos">SOS</NavLink>
        <NavLink to="/volunteer">Volunteer</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        {token ? (
          <button className="ghost-button" type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
