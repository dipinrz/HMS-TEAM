import { Box, Grid, Typography, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  AccessTime,
  CalendarToday,
  EventAvailable,
  MedicalServices,
  Person,
  Phone,
  VideoCall,
} from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import DashboardMetrics from "../../components/PATIENT/DashboardMetrics";
import { getPatientAppointments } from "../../services/patientApi";
import { useAuthStore } from "../../store/useAuthStore";
import AppointmentModal from "../../components/PATIENT/AppointmentModal";
import { Card, CardContent } from "../../components/ui/CustomCards";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getPatientAppointments();
        console.log("All apoinments",res.data.appointments)
        const now = new Date();
        const upcoming = res.data.appointments
          .filter((appt: any) => new Date(appt.appointment_date) > now)
          .sort(
            (a: any, b: any) =>
              new Date(a.appointment_date).getTime() -
              new Date(b.appointment_date).getTime()
          );
          console.log("Upcoming apoinments ",upcoming)
        setAppointments(upcoming);
      } catch (err) {
        toast.error("Failed to fetch appointments");
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);


  const handleViewClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const getAppointmentIcon = (mode: string) => {
    switch (mode) {
      case "video":
        return <VideoCall />;
      case "phone":
        return <Phone />;
      default:
        return <MedicalServices />;
    }
  };

  return (
    <Box sx={{ minHeight: '92vh', paddingX: "30px", paddingBottom: '40px', backgroundColor: "#f8fafc", minWidth: '360px' }} >
      <Box
        sx={{ marginTop: { xs: "10vh", md: "3vh" } }}
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        mb={4}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            Welcome, {user?.first_name}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flexWrap="wrap"
        >
          <CustomButton
            label="BOOK APPOINTMENT"
            variant="contained"
            startIcon={<MedicalServices fontSize="small" />}
            onClick={() => navigate("/patient/book-appointments")}
          />
        </Stack>
      </Box>

      <Box sx={{ width: "100%", mt: 5 }}>
        <DashboardMetrics />
      </Box>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              marginTop: "20px",
              minWidth: '320px',
              minHeight: '20px',
              marginRight: '10px',
              p: 3,
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
       
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                pb: 2,
              }}
            >
              <CalendarToday
                sx={{ color: "primary.main", mr: 2, fontSize: "28px" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                Upcoming Appointments
              </Typography>
            </Box>

            {appointments.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  color: "text.secondary",
                }}
              >
                <EventAvailable
                  sx={{
                    fontSize: "48px",
                    color: "action.disabled",
                    mb: 2,
                  }}
                />
                <Typography variant="body1" color="text.disabled">
                  No appointments scheduled
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflowY: "au ", flex: 1, pr: 1 }}>
                {appointments.slice(0, 3).map((appt) => (
                  <Card
                    key={appt.appointment_id}
                    animated={false}
                    sx={{
                      mb: 2,
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "#ffffff",
                    }}
                  >

                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }} 
                        justifyContent="space-between"
                        alignItems={{ xs: "center", sm: "center" }}
                        gap={2} 
                      >
                        {/* Left Section: Icon + Typography */}
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              background: "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                              borderRadius: "10px",
                              width: "48px",
                              height: "48px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            {getAppointmentIcon(appt.mode || "in-person")}
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="text.primary"
                              sx={{
                                mb: 0.5,
                                width: '130px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'inline-block',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {appt.reason_for_visit || "General Checkup"}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "flex", alignItems: "center", gap: 1 }}
                            >
                              <Person fontSize="small" />
                              Dr. {appt.doctor?.first_name} {appt.doctor?.last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                            >
                              <AccessTime fontSize="small" />
                              {new Date(appt.appointment_date).toLocaleString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Right Section: Button */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "flex-start", sm: "flex-end" },
                            mt: { xs: 2, sm: 0 }, 
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewClick(appt)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                              px: 1.5,
                              py: 0.5,
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>


                  </Card>
                ))}
              </Box>
            )}
            <AppointmentModal
              open={isModalOpen}
              onClose={handleCloseModal}
              appointment={selectedAppointment}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Future section like calendar or history */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
