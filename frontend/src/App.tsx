// src/App.tsx
import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboad";
import RegisterPage from "./pages/Auth/RegisterPage";
import Sidebar from "./components/SideBar";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/NavBar";
import AllPatients from "./pages/Admin-pages/AllPatients";
import AllDoctors from "./pages/Admin-pages/AllDoctors";
import TestBookAppointment from "./pages/PatientUtility/Appointment";
import { AllMedicines } from './pages/Admin-pages/AllMedicines';
import DoctorAppointments from './pages/Doctor-pages/DoctorAppointments';
import AdminDepartmentsPage from './pages/Admin-pages/AllDepartment';
import AppointmentDetail from "./pages/PatientUtility/AppointmentDetail";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1a237e",
          color: "white",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.16)",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const noSidebarRoutes = ["/", "/signup", "/unauthorized"];

  const shouldShowSidebar =
    user && !noSidebarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {shouldShowSidebar && (
          <Navbar handleDrawerToggle={handleDrawerToggle} />
        )}

        {shouldShowSidebar && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            width: '100%',
            ...(shouldShowSidebar && {
              width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
              ml: { md: 0 },
              pt: { xs: '64px' },
            }),
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
            <Route path="/signup" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AllPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AllDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDepartmentsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/medicines"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AllMedicines />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <div>Doctor Prescriptions Page</div>
                </ProtectedRoute>
              }
            />

            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <TestBookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/doctors"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <div>Patient Doctors Page</div>
                </ProtectedRoute>
              }
            />

            <Route path="/appointment/:id" element={<AppointmentDetail />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={2000} />
    </ThemeProvider>
  );
}

export default App;
