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
      <Box sx={{ display: "flex" }}>
        {shouldShowSidebar && (
          <>
            <Navbar />
            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          </>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            ...(shouldShowSidebar && {
              marginLeft: { xs: 0 },
              width: {
                xs: "100%",
                sm: "calc(100% - 64px)",
                md: "calc(100% - 240px)",
              },
            }),
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
            <Route path="/signup" element={<RegisterPage />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/users" element={<AllPatients />} />
            <Route path="/admin/doctors" element={<AllDoctors />} />

            <Route
              path="/doctor/*"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient/*"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookAppointment"
              element={
                <ProtectedRoute allowedRoles={["patient", "admin"]}>
                  <TestBookAppointment />
                </ProtectedRoute>
              }
            />
            <Route path="/appointmentDetail" element={<AppointmentDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={2000} />
    </ThemeProvider>
  );
}

export default App;
