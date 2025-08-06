import { Route, Routes } from "react-router-dom"
import Test from "./test/Test"
import AdminDashboard from "./pages/dashboards/AdminDashboard"
import Navbar from "./components/NavBar"
import AppointmentsAndActions from "./components/ADMIN/Appointments&Actions"
import Login from "./pages/Auth/Login"


const App = () => {
  return (
    <div>
      {/* <Test/> */}
      <Routes>
        <Route path="/admin-test" Component={Login}/>
        <Route path='login' Component={Login} />
      </Routes>
    </div>
  )
}

export default App