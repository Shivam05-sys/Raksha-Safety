import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SOS from "./pages/SOS";
import VolunteerDashboard from "./pages/VolunteerDashboard";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
