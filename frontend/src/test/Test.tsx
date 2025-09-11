
import Navbar from "../components/NavBar";
import LoginPage from "../pages/Auth/Login";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboad";

const Test = () => {
  return (
    <div>
      <Navbar handleDrawerToggle={() => { }} />
      <AdminDashboard />
      <DoctorDashboard />
      <PatientDashboard />
      <LoginPage />
    </div>
  );
};

export default Test;