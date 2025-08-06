
import Navbar from "../components/NavBar";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboad";

const Test = () => {
  return (
    <div>
      <Navbar />
      <AdminDashboard />
      <DoctorDashboard />
      <PatientDashboard />
    </div>
  );
};

export default Test;
