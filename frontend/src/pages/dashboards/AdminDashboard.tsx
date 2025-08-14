import {
  Stack,
  Typography,
  Box,
  TextField,
  MenuItem,
  Modal,
  Button,
} from "@mui/material";
import CustomButton from "../../components/ui/CustomButton";
import { CalendarCheck, UserRoundPlus } from "lucide-react";
import DashboardCharts from "../../components/ADMIN/DashboardCharts";
import DashboardMetrics from "../../components/ADMIN/DashboardMetrics";
import AppointmentsAndActions from "../../components/ADMIN/Appointments&Actions";
import SystemStatusCard from "../../components/ADMIN/SystemStatusCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllDepartments, registerDoctor } from "../../services/adminAPi";

interface DoctorForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department_id: 0;
}
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
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
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to register doctor");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
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

  return (
    <Box sx={{ paddingX: "30px" }}>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background:
                "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Register New Doctor
          </Box>

          {/* Body */}
          <Box sx={{ p: 3, bgcolor: "#f5f7fa" }}>
            <Stack
              spacing={3}
              sx={{
                "& .MuiTextField-root": {
                  backgroundColor: "#fff",
                  borderRadius: 1.5,
                },
              }}
            >
              {/* Personal Information */}
              <Stack spacing={2}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                    borderBottom: "2px solid #e3f2fd",
                    pb: 0.5,
                  }}
                >
                  Personal Information
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="first_name"
                    label="First Name"
                    fullWidth
                    size="small"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  <TextField
                    name="last_name"
                    label="Last Name"
                    fullWidth
                    size="small"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </Stack>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Stack>

              {/* Professional Information */}
              <Stack spacing={2}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                    borderBottom: "2px solid #e3f2fd",
                    pb: 0.5,
                  }}
                >
                  Professional Information
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    name="department_id"
                    label="Department"
                    fullWidth
                    size="small"
                    value={formData.department_id}
                    onChange={handleChange}
                  >
                    {departments.map((dept: any) => (
                      <MenuItem
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="specialization"
                    label="Specialization"
                    fullWidth
                    size="small"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="qualification"
                    label="Qualification"
                    fullWidth
                    size="small"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                  <TextField
                    name="years_of_experience"
                    label="Years of Experience"
                    type="number"
                    fullWidth
                    size="small"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                  />
                </Stack>
                <TextField
                  name="license_number"
                  label="License Number"
                  fullWidth
                  size="small"
                  value={formData.license_number}
                  onChange={handleChange}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#f5f7fa",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                background:
                  "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #020aa5ff 0%, #000000ff 100%)",
                },
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Modal>

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
            sx={{
              fontSize: {
                xs: "1.75rem",
                sm: "2.125rem",
              },
            }}
          >
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
            }}
          >
            Comprehensive healthcare system overview and management
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flexWrap="wrap"
        >
          <CustomButton
            sx={{
              color: "black",
              borderRadius: "12px",
              border: "1px solid lightgrey",

              marginBottom: {
                xs: "5px",
                backgroundColor: "#46923c",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3b8123",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              },
            }}
            label="ADD DOCTOR"
            variant="outlined"
            startIcon={<UserRoundPlus fontSize="small" />}
            onClick={handleOpenModal}
          />

          <CustomButton
            sx={{
              background:
                "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
              borderRadius: "12px",
            }}
            label="VIEW ALL APPOINMENTS"
            variant="contained"
            color="primary"
            startIcon={<CalendarCheck fontSize="small" />}
            onClick={() => {
              navigate('/admin/appointments')
            }}
          />
        </Stack>
      </Box>

      {/* Metrics */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <DashboardMetrics />
      </Box>

      {/* Charts */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <DashboardCharts />
      </Box>

      {/* Appoinments & Quick actions */}

      <Box sx={{ width: "100%", mt: 5 }}>
        <AppointmentsAndActions />
      </Box>

      {/* System stats */}

      <Box sx={{ width: "100%", mt: 5 }}>
        <SystemStatusCard />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
