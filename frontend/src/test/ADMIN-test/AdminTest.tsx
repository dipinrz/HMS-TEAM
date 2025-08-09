import Navbar from "../../components/NavBar"
import AdminDoctorsPage from "../../pages/Admin-pages/AllDoctors"
import AdminPatientsPage from "../../pages/Admin-pages/allPatients"
import AdminDashboard from "../../pages/dashboards/AdminDashboard"


const AdminTest = () => {
  return (
    <div>
       <AdminPatientsPage/>
       <AdminDoctorsPage/>
    </div>
  )
}

export default AdminTest
