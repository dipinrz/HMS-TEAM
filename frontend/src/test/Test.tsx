import AdminDashboard from "../components/dashboards/AdminDashboard";
import DoctorDashboard from "../components/dashboards/DoctorDashboard";
import PatientDashboard from "../components/dashboards/PatientDashboad";
import Navbar from "../components/NavBar";

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
