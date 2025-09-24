// import { lazy, Suspense, useState } from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import {
//   Box,
//   CircularProgress,
//   CssBaseline,
//   ThemeProvider,
//   createTheme,
// } from "@mui/material";
// import { ToastContainer } from "react-toastify";
// import LoginPage from "./pages/Auth/Login";
// import ProtectedRoute from "./routes/ProtectedRoutes";
// const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
// import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
// import PatientDashboard from "./pages/dashboards/PatientDashboad";
// import RegisterPage from "./pages/Auth/RegisterPage";
// import Sidebar from "./components/SideBar";
// import { useAuthStore } from "./store/useAuthStore";
// import Navbar from "./components/NavBar";
// import AllPatients from "./pages/Admin-pages/AllPatients";
// import AllDoctors from "./pages/Admin-pages/AllDoctors";
// import TestBookAppointment from "./pages/PatientUtility/Appointment";
// import { AllMedicines } from "./pages/Admin-pages/AllMedicines";
// import DoctorAppointments from "./pages/Doctor-pages/DoctorAppointments";
// import AdminDepartmentsPage from "./pages/Admin-pages/AllDepartment";
// import DoctorPriscriptions from "./pages/Doctor-pages/DoctorPriscriptions";
// import AddPrescription from "./pages/Doctor-pages/AddPrescription";
// import DoctorProfileUpdate from "./pages/Doctor-pages/DoctorProfileUpdate";
// import AdminAppointment from "./components/ADMIN/appoinments/AdminAppointments";
// import ForgotPass from "./pages/Auth/ForgotPass";
// import ResetPass from "./pages/Auth/ResetPass";
// import PatientReport from "./pages/Doctor-pages/PatientReport";
// import DoctorPatients from "./pages/Doctor-pages/DoctorPatients";
// import ListOfDoctors from "./pages/Doctor-pages/ListOfDoctors";
// import MedicalRecord from "./pages/PatientUtility/MedicalRecord";
// import ProfilePage from "./pages/PatientUtility/ProfilePage";
// import AllAppointments from "./pages/PatientUtility/AllAppointments";
// import PaymentHistory from "./pages/PatientUtility/PaymentHistory";
// import Bill from "./pages/PatientUtility/Bill";
// import AdminPaymentsTable from "./pages/Admin-pages/AllPayments";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//     background: {
//       default: "#f5f5f5",
//     },
    
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
//   components: {
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: "#1a237e",
//           color: "white",
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           "&.Mui-selected": {
//             backgroundColor: "rgba(255, 255, 255, 0.16)",
//           },
//           "&:hover": {
//             backgroundColor: "rgba(255, 255, 255, 0.08)",
//           },
//         },
//       },
//     },
//   },
// });

// const drawerWidth = 280;

// function App() {
//   const location = useLocation();
//   const { user } = useAuthStore();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const noSidebarRoutes = [
//     "/",
//     "/signup",
//     "/unauthorized",
//     "/forgot-pass",
//     "/reset-pass",
//   ];

//   const shouldShowSidebar =
//     user && !noSidebarRoutes.includes(location.pathname);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         {shouldShowSidebar && (
//           <Navbar handleDrawerToggle={handleDrawerToggle} />
//         )}

//         {shouldShowSidebar && (
//           <Sidebar
//             mobileOpen={mobileOpen}
//             handleDrawerToggle={handleDrawerToggle}
//           />
//         )}

//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//             backgroundColor: "#f5f5f5",
//             width: "100%",
//             ...(shouldShowSidebar && {
//               width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
//               ml: { md: 0 },
//               pt: { xs: "64px" },
//             }),
//           }}
//         >
//           <Routes>
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
//             <Route path="/signup" element={<RegisterPage />} />
//             <Route path="/forgot-pass" element={<ForgotPass />} />
//             <Route path="/reset-password/:token" element={<ResetPass />} />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Suspense
//                     fallback={
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           height: "100vh",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <CircularProgress />
//                         <p style={{ marginTop: "10px", fontSize: "16px" }}>
//                           Loading Dashboard...
//                         </p>
//                       </div>
//                     }
//                   >
//                     <AdminDashboard />
//                   </Suspense>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/users"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllPatients />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/doctors"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllDoctors />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/departments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminDepartmentsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/medicines"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllMedicines />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="admin/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminAppointment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/payments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminPaymentsTable/>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Doctor Routes */}
//             <Route
//               path="/doctor/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorAppointments />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/prescriptions"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorPriscriptions />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/getProfile"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <DoctorProfileUpdate />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/prescription/:appointmentId/:patientId"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <AddPrescription />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/report/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <PatientReport />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/patients"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <DoctorPatients />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/doctors"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <ListOfDoctors />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Patient Routes */}
//             <Route
//               path="/patient/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <PatientDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/patient/book-appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <TestBookAppointment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/medical-record"
//               element={
//                 <ProtectedRoute allowedRoles={['patient']}>
//                   <MedicalRecord />
//                 </ProtectedRoute>
//               }
//             />
            
//             <Route
//               path="/patient/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <AllAppointments />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/profile/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <ProfilePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/payment-history"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <PaymentHistory />
//                 </ProtectedRoute>
//               }
//             />


//             <Route
//               path="/patient/bills"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <Bill />
//                 </ProtectedRoute>
//               }
//             />


//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </Box>
//       </Box>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </ThemeProvider>
//   );
// }

// export default App;


// import { lazy, Suspense, useState } from "react";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import {
//   Box,
//   CircularProgress,
//   CssBaseline,
//   ThemeProvider,
//   createTheme,
// } from "@mui/material";
// import { ToastContainer } from "react-toastify";
// import LoginPage from "./pages/Auth/Login";
// import ProtectedRoute from "./routes/ProtectedRoutes";
// const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
// import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
// import PatientDashboard from "./pages/dashboards/PatientDashboad";
// import RegisterPage from "./pages/Auth/RegisterPage";
// import Sidebar from "./components/SideBar";
// import { useAuthStore } from "./store/useAuthStore";
// import Navbar from "./components/NavBar";
// import AllPatients from "./pages/Admin-pages/AllPatients";
// import AllDoctors from "./pages/Admin-pages/AllDoctors";
// import TestBookAppointment from "./pages/PatientUtility/Appointment";
// import { AllMedicines } from "./pages/Admin-pages/AllMedicines";
// import DoctorAppointments from "./pages/Doctor-pages/DoctorAppointments";
// import AdminDepartmentsPage from "./pages/Admin-pages/AllDepartment";
// import DoctorPriscriptions from "./pages/Doctor-pages/DoctorPriscriptions";
// import AddPrescription from "./pages/Doctor-pages/AddPrescription";
// import DoctorProfileUpdate from "./pages/Doctor-pages/DoctorProfileUpdate";
// import AdminAppointment from "./components/ADMIN/appoinments/AdminAppointments";
// import ForgotPass from "./pages/Auth/ForgotPass";
// import ResetPass from "./pages/Auth/ResetPass";
// import PatientReport from "./pages/Doctor-pages/PatientReport";
// import DoctorPatients from "./pages/Doctor-pages/DoctorPatients";
// import ListOfDoctors from "./pages/Doctor-pages/ListOfDoctors";
// import MedicalRecord from "./pages/PatientUtility/MedicalRecord";
// import ProfilePage from "./pages/PatientUtility/ProfilePage";
// import AllAppointments from "./pages/PatientUtility/AllAppointments";
// import PaymentHistory from "./pages/PatientUtility/PaymentHistory";
// import Bill from "./pages/PatientUtility/Bill";
// import AdminPaymentsTable from "./pages/Admin-pages/AllPayments";
// import ErrorBoundary from "./components/ErrorBoundary";
// import ServerDownPage from "./pages/ServerDownPage";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//     background: {
//       default: "#f5f5f5",
//     },
    
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
//   components: {
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: "#1a237e",
//           color: "white",
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           "&.Mui-selected": {
//             backgroundColor: "rgba(255, 255, 255, 0.16)",
//           },
//           "&:hover": {
//             backgroundColor: "rgba(255, 255, 255, 0.08)",
//           },
//         },
//       },
//     },
//   },
// });

// const drawerWidth = 280;

// function App() {
//   const location = useLocation();
//   const { user } = useAuthStore();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const noSidebarRoutes = [
//     "/",
//     "/signup",
//     "/unauthorized",
//     "/forgot-pass",
//     "/reset-pass",
//   ];

//   const shouldShowSidebar =
//     user && !noSidebarRoutes.includes(location.pathname);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />

//       <ErrorBoundary fallback={<ServerDownPage />}>
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         {shouldShowSidebar && (
//           <Navbar handleDrawerToggle={handleDrawerToggle} />
//         )}

//         {shouldShowSidebar && (
//           <Sidebar
//             mobileOpen={mobileOpen}
//             handleDrawerToggle={handleDrawerToggle}
//           />
//         )}

//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//             backgroundColor: "#f5f5f5",
//             width: "100%",
//             ...(shouldShowSidebar && {
//               width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
//               ml: { md: 0 },
//               pt: { xs: "64px" },
//             }),
//           }}
//         >
//           <Routes>
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
//             <Route path="/signup" element={<RegisterPage />} />
//             <Route path="/forgot-pass" element={<ForgotPass />} />
//             <Route path="/reset-password/:token" element={<ResetPass />} />
//             <Route path="/server-down" element={<ServerDownPage />} />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Suspense
//                     fallback={
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           height: "100vh",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <CircularProgress />
//                         <p style={{ marginTop: "10px", fontSize: "16px" }}>
//                           Loading Dashboard...
//                         </p>
//                       </div>
//                     }
//                   >
//                     <AdminDashboard />
//                   </Suspense>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/users"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllPatients />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/doctors"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllDoctors />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/departments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminDepartmentsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/medicines"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AllMedicines />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="admin/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminAppointment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/payments"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminPaymentsTable/>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Doctor Routes */}
//             <Route
//               path="/doctor/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorAppointments />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/prescriptions"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <DoctorPriscriptions />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/doctor/getProfile"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <DoctorProfileUpdate />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/prescription/:appointmentId/:patientId"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <AddPrescription />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/report/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["doctor"]}>
//                   <PatientReport />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/patients"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <DoctorPatients />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="doctor/doctors"
//               element={
//                 <ProtectedRoute allowedRoles={['doctor']}>
//                   <ListOfDoctors />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Patient Routes */}
//             <Route
//               path="/patient/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <PatientDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/patient/book-appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <TestBookAppointment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/medical-record"
//               element={
//                 <ProtectedRoute allowedRoles={['patient']}>
//                   <MedicalRecord />
//                 </ProtectedRoute>
//               }
//             />
            
//             <Route
//               path="/patient/appointments"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <AllAppointments />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/profile/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <ProfilePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/payment-history"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <PaymentHistory />
//                 </ProtectedRoute>
//               }
//             />


//             <Route
//               path="/patient/bills"
//               element={
//                 <ProtectedRoute allowedRoles={["patient"]}>
//                   <Bill />
//                 </ProtectedRoute>
//               }
//             />


//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </Box>
//       </Box>
//       <ToastContainer position="top-right" autoClose={2000} />
//       </ErrorBoundary>
//     </ThemeProvider>
//   );
// }

// export default App;


// src/App.tsx
import { lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboad";
import RegisterPage from "./pages/Auth/RegisterPage";
import Sidebar from "./components/SideBar";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/NavBar";
import AllPatients from "./pages/Admin-pages/AllPatients";
import AllDoctors from "./pages/Admin-pages/AllDoctors";
import TestBookAppointment from "./pages/PatientUtility/Appointment";
import { AllMedicines } from "./pages/Admin-pages/AllMedicines";
import DoctorAppointments from "./pages/Doctor-pages/DoctorAppointments";
import AdminDepartmentsPage from "./pages/Admin-pages/AllDepartment";
import DoctorPriscriptions from "./pages/Doctor-pages/DoctorPriscriptions";
import AddPrescription from "./pages/Doctor-pages/AddPrescription";
import DoctorProfileUpdate from "./pages/Doctor-pages/DoctorProfileUpdate";
import AdminAppointment from "./components/ADMIN/appoinments/AdminAppointments";
import ForgotPass from "./pages/Auth/ForgotPass";
import ResetPass from "./pages/Auth/ResetPass";
import PatientReport from "./pages/Doctor-pages/PatientReport";
import DoctorPatients from "./pages/Doctor-pages/DoctorPatients";
import ListOfDoctors from "./pages/Doctor-pages/ListOfDoctors";
import MedicalRecord from "./pages/PatientUtility/MedicalRecord";
import ProfilePage from "./pages/PatientUtility/ProfilePage";
import AllAppointments from "./pages/PatientUtility/AllAppointments";
import PaymentHistory from "./pages/PatientUtility/PaymentHistory";
import Bill from "./pages/PatientUtility/Bill";
import AdminPaymentsTable from "./pages/Admin-pages/AllPayments";
import ErrorBoundary from "./components/ErrorBoundary";
import ServerDownPage from "./pages/ServerDownPage";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: "#1a237e", color: "white" } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": { backgroundColor: "rgba(255, 255, 255, 0.16)" },
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
        },
      },
    },
  },
});

const drawerWidth = 280;

function App() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Routes that should NOT show sidebar
  const noSidebarRoutes = [
    "/",
    "/signup",
    "/unauthorized",
    "/forgot-pass",
    "/reset-password/:token",
    "/server-down",
  ];

  const shouldShowSidebar = user && !noSidebarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallback={<ServerDownPage />}>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar + Navbar only for allowed routes */}
          {shouldShowSidebar && <Navbar handleDrawerToggle={handleDrawerToggle} />}
          {shouldShowSidebar && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#f5f5f5",
              width: "100%",
              ...(shouldShowSidebar && {
                width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
                ml: { md: 0 },
                pt: { xs: "64px" },
              }),
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
              <Route path="/forgot-pass" element={<ForgotPass />} />
              <Route path="/reset-password/:token" element={<ResetPass />} />
              <Route path="/server-down" element={<ServerDownPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Suspense fallback={<LoadingFallback text="Loading Dashboard..." />}>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AllPatients /></ProtectedRoute>} />
              <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><AllDoctors /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDepartmentsPage /></ProtectedRoute>} />
              <Route path="/admin/medicines" element={<ProtectedRoute allowedRoles={["admin"]}><AllMedicines /></ProtectedRoute>} />
              <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAppointment /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPaymentsTable /></ProtectedRoute>} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
              <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>} />
              <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorPriscriptions /></ProtectedRoute>} />
              <Route path="/doctor/getProfile" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorProfileUpdate /></ProtectedRoute>} />
              <Route path="/doctor/prescription/:appointmentId/:patientId" element={<ProtectedRoute allowedRoles={["doctor"]}><AddPrescription /></ProtectedRoute>} />
              <Route path="/doctor/report/:id" element={<ProtectedRoute allowedRoles={["doctor"]}><PatientReport /></ProtectedRoute>} />
              <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorPatients /></ProtectedRoute>} />
              <Route path="/doctor/doctors" element={<ProtectedRoute allowedRoles={["doctor"]}><ListOfDoctors /></ProtectedRoute>} />

              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
              <Route path="/patient/book-appointments" element={<ProtectedRoute allowedRoles={["patient"]}><TestBookAppointment /></ProtectedRoute>} />
              <Route path="/patient/medical-record" element={<ProtectedRoute allowedRoles={["patient"]}><MedicalRecord /></ProtectedRoute>} />
              <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><AllAppointments /></ProtectedRoute>} />
              <Route path="/patient/profile/:id" element={<ProtectedRoute allowedRoles={["patient"]}><ProfilePage /></ProtectedRoute>} />
              <Route path="/patient/payment-history" element={<ProtectedRoute allowedRoles={["patient"]}><PaymentHistory /></ProtectedRoute>} />
              <Route path="/patient/bills" element={<ProtectedRoute allowedRoles={["patient"]}><Bill /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
        <ToastContainer position="top-right" autoClose={2000} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

function LoadingFallback({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <CircularProgress />
      <p style={{ marginTop: 10, fontSize: 16 }}>{text}</p>
    </div>
  );
}
