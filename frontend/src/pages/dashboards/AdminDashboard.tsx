import { Stack, Typography, Box, Modal } from "@mui/material";
import CustomButton from "../../components/ui/CustomButton";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

const CalendarCheckIcon = lazy(() => import("@mui/icons-material/CalendarToday"));
const UserRoundPlusIcon = lazy(() => import("@mui/icons-material/PersonAdd"));

import { toast } from "react-toastify";
import { fetchAllDepartments, registerDoctor } from "../../services/adminAPi";
import { useNavigate } from "react-router-dom";

const DashboardCharts = lazy(() => import("../../components/ADMIN/dashboard/DashboardCharts"));
const DashboardMetrics = lazy(() => import("../../components/ADMIN/dashboard/DashboardMetrics"));
const AppointmentsAndActions = lazy(() => import("../../components/ADMIN/dashboard/Appointments&Actions"));
const SystemStatusCard = lazy(() => import("../../components/ADMIN/dashboard/SystemStatusCard"));
const DoctorsModal = lazy(() => import("../../components/ADMIN/doctors/DoctorsModal"));

interface DoctorForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department_id: number;
}

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DoctorForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    license_number: "",
    years_of_experience: 0,
    department_id: 0,
  });

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      specialization: "",
      qualification: "",
      license_number: "",
      years_of_experience: 0,
      department_id: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerDoctor(formData);
      toast.success("Doctor registered successfully!");
      handleCloseModal();
    } catch (error) {
      if (error) {
        toast.error("Failed to register doctor");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    const timer = setTimeout(() => setShowExtras(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const loadDepartments = async () => {
    try {
      const department = await fetchAllDepartments();
      setDepartments(department.data.data.departments);
    } catch (error) {
      toast.error("Couldn't fetch departments");
      console.log("Error in fetching departments", error);
    }
  };
  const memoizedDepartments = useMemo(() => departments, [departments]);

  return (
    <Box
      sx={{
        paddingX: "30px",
        backgroundColor: "#f8fafc",
        paddingBottom:"20px"
      }}
    >
      {open && (
        <Modal open={open} onClose={handleCloseModal}>
          <Suspense fallback={<div>Loading modal...</div>}>
            <DoctorsModal
              open={open}
              handleCloseModal={handleCloseModal}
              isEditMode={false}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              departments={memoizedDepartments}
            />
          </Suspense>
        </Modal>
      )}

      <Box
        sx={{
          marginTop: {
            xs: "20vh",
            md: "3vh",
          },
        }}
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        mb={4}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={600}
            color="text.primary"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
          >
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Comprehensive healthcare system overview and management
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flexWrap="wrap"
        >
          <Suspense fallback={null}>
            <CustomButton
              sx={{
                borderRadius: "12px",
                marginBottom: {
                  xs: "5px",
                },
                backgroundColor: "#46923c",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3b8123",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
              label="ADD DOCTOR"
              variant="contained"
              startIcon={<UserRoundPlusIcon fontSize="small" />}
              onClick={handleOpenModal}
            />
          </Suspense>

          <Suspense fallback={null}>
            <CustomButton
              sx={{
                background:
                  "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                borderRadius: "12px",
              }}
              label="VIEW ALL APPOINMENTS"
              variant="contained"
              color="primary"
              startIcon={<CalendarCheckIcon fontSize="small" />}
              onClick={() => {
                navigate("/admin/appointments");
              }}
            />
          </Suspense>
        </Stack>
      </Box>

      {/* Metrics */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Suspense fallback={<div>Loading metrics...</div>}>
          <DashboardMetrics />
        </Suspense>
      </Box>

      {/* Charts */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Suspense fallback={<div>Loading charts...</div>}>
          <DashboardCharts />
        </Suspense>
      </Box>

      {/* Deferred heavy widgets */}
      {showExtras && (
        <>
          <Box sx={{ width: "100%", mt: 5 }}>
            <Suspense fallback={<div>Loading appointments...</div>}>
              <AppointmentsAndActions />
            </Suspense>
          </Box>

          <Box sx={{ width: "100%", mt: 5 }}>
            <Suspense fallback={<div>Loading system status...</div>}>
              <SystemStatusCard />
            </Suspense>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
