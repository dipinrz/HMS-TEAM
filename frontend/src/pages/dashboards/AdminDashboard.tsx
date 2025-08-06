import { Stack, Typography, Box } from "@mui/material";
import CustomButton from "../../components/ui/CustomButton";
import { CalendarCheck, UserRoundPlus } from "lucide-react";
import DashboardCharts from "../../components/ADMIN/DashboardCharts";
import DashboardMetrics from "../../components/ADMIN/DashboardMetrics";
import AppointmentsAndActions from "../../components/ADMIN/Appointments&Actions";
import SystemStatusCard from "../../components/ADMIN/SystemStatusCard";
import { useState } from "react";
import CustomModal from "../../components/ui/CustomModal";

const AdminDashboard = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = () => {
    console.log("Submitted user!");
    handleCloseModal();
  };

  return (
    <Box>
      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        title="Add New User"
        content={
          <Typography variant="body1" textAlign="center">
            User registration form will go here.
          </Typography>
        }
        actions={
          <Stack direction="row" spacing={2}>
            <CustomButton color="error" label="Close" onClick={handleCloseModal} variant="outlined" />
              
           
            <CustomButton
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              label="submit"
            
            />
            
          </Stack>
        }
      />

      <Box
        sx={{
          marginTop: {
            xs: "28vh",
            md: "10vh",
          },
        }}
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', md: 'row' }}
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

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap">
          <CustomButton
            sx={{
              color: "black",
              borderRadius: "12px",
              border: "1px solid lightgrey",


              marginBottom:{
                xs:'5px'
              }
            }}
            label="Add User"
            variant="outlined"
            startIcon={<UserRoundPlus fontSize="small" />}
            onClick={handleOpenModal}
          />

          <CustomButton
            sx={{
              backgroundColor: "#3c2cebff",
              borderRadius: "12px",
              
            }}
            label="View All Appointments"
            variant="contained"
            color="primary"
            startIcon={<CalendarCheck fontSize="small" />}
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
