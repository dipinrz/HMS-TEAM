import { useEffect, useState } from "react";
import {
  cancelAppointent,
  getPatientAppointments,
  getPatientPrescriptionsByAppointmentId,
} from "../../services/patientApi";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import CustomButton from "../../components/ui/CustomButton";
import {
  CalendarToday,
  MedicalServices,
  Notes,
  Person,
  Cancel,
} from "@mui/icons-material";
import PrescriptionModal from "../../components/PATIENT/PrescriptionModal";
import CustomModal from "../../components/ui/CustomModal";
import type { ApiError } from "./Appointment";

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const theme = useTheme();
  const [prescriptions, setPrescriptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [selectAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [openCancekModal, setOpenCancelModal] = useState(false);

  const viewAllAppointments = async () => {
    try {
      const res = await getPatientAppointments();
      setAppointments(res.data.appointments);
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error(error);
    }
  };

  const viewPrescription = async (appointId: number) => {
    try {
      const res = await getPatientPrescriptionsByAppointmentId(appointId);
      setPrescriptions(res.data.prescriptions);
      setOpenModal(true);
    } catch (error) {
      toast.error("Failed to fetch prescription");
    }
  };

  const handleOpenCancelModal = (id: number) => {
    setOpenCancelModal(true);
    setSelectedAppointmentId(id);
  };

  const cancelling = async () => {
    try {
      if (!selectAppointmentId) return;
      const response = await cancelAppointent(selectAppointmentId);
      const { success, message } = response.data;
      if (success == true) {
        toast.success(message);
        setOpenCancelModal(false);
        viewAllAppointments();
      } else {
        toast.error(message);
      }
    } catch (error) {
        const apierr=error as ApiError
        const errorMessage= apierr.data?.message || "Failed to cancel appointment"
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    viewAllAppointments();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <MedicalServices fontSize="large" />
        My Appointments
      </Typography>

      <Grid container spacing={3}>
        {appointments.map((appt: any) => (
          <Grid size={{ xs: 12 }} key={appt.appointment_id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                transition: "all 0.3s ease",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* Appointment Details */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      gap: 2,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        background:
                          "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                        color: theme.palette.primary.main,
                        borderRadius: "10px",
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarToday sx={{ color: "white" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          overflow: { xs: "hidden" },
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        {appt.reason_for_visit}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <Person fontSize="small" />
                        Dr. {appt.doctor.first_name} {appt.doctor.last_name}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={appt.status}
                        size="medium"
                        sx={{
                          fontWeight: 600,
                          textTransform: "capitalize",
                          height: { sm: "25px", xs: "25px" },
                          width: { sm: "79px" },
                          fontSize: { xs: "10px" },
                          color:
                            appt.status === "completed"
                              ? "success.main"
                              : appt.status === "cancelled"
                              ? "error.main"
                              : "primary.main",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Date/Time and Department */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                      pl: { md: 3 },
                      py: { md: 1 },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CalendarToday color="primary" fontSize="small" />
                      {new Date(appt.appointment_date).toLocaleString([], {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <MedicalServices color="primary" fontSize="small" />
                      {appt.department.name}
                    </Typography>
                    {appt.notes && (
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Notes color="primary" fontSize="small" />
                        {appt.notes}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Actions */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "center", md: "flex-end" },
                      gap: 2,
                      // border:"1px solid",
                      borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                      pl: { md: 3 },
                    }}
                  >
                    <CustomButton
                      variant="outlined"
                      size="medium"
                      label="View Prescription"
                      onClick={() => viewPrescription(appt.appointment_id)}
                      sx={{
                        width: {
                          lg: "180px",
                          md: "180px",
                          sm: "180px",
                          xs: "180px",
                        },
                        borderRadius: "8px",
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    />
                    {appt.status == "scheduled" && (
                      <CustomButton
                        variant="outlined"
                        size="medium"
                        label="Cancel"
                        color="error"
                        onClick={() =>
                          handleOpenCancelModal(appt.appointment_id)
                        }
                        startIcon={<Cancel />}
                        sx={{
                          width: {
                            lg: "180px",
                            md: "180px",
                            sm: "180px",
                            xs: "180px",
                          },
                          borderRadius: "8px",
                          px: 3,
                          py: 1,
                          textTransform: "none",
                          fontWeight: 600,
                          gap: 1,
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <PrescriptionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Prescription"
        prescriptions={prescriptions}
      />

      <CustomModal
        open={openCancekModal}
        onClose={() => setOpenCancelModal(false)}
        title="Cancel Appoinment"
        content={
          <>
            <Typography textAlign={"center"}>Do you want to cancel</Typography>
          </>
        }
        actions={
          <>
            <Button onClick={() => setOpenCancelModal(false)} color="secondary">
              No
            </Button>
            <Button
              onClick={() => cancelling()}
              variant="contained"
              color="error"
            >
              Yes, Cancel
            </Button>
          </>
        }
      />
    </Box>
  );
}

export default AllAppointments;
