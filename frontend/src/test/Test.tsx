import AdminDashboard from "../components/dashboards/AdminDashboard"
import DoctorDashboard from "../components/dashboards/DoctorDashboard"
import Navbar from "../components/NavBar"

const Test = () => {
  return (
    <div>
        <Navbar />
      <AdminDashboard/>
      <DoctorDashboard/>
    </div>
  )
}

export default Test