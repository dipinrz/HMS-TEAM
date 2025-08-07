import { Route, Routes } from "react-router-dom"
import Test from "./test/Test"
import Login from "./pages/Auth/Login"
import PatientDashboard from "./pages/dashboards/PatientDashboad"


const App = () => {
  return (
    <div>
      {/* <Test/> */}
      <Routes>
        <Route path="/admin-test" Component={Login}/>
        <Route path='login' Component={Login} />
        <Route path='/patient' Component={PatientDashboard} />
      </Routes>
    </div>
  )
}

export default App